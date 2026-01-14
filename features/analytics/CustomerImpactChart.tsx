import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CURRENCY_SYMBOL } from "@/utils/currency";
import type { Customer, Transaction } from "@/types/customer";

dayjs.extend(isBetween);

type ViewMode = "year" | "month" | "week";
const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  customers: Customer[];
  transactions: Transaction[];
}

type CustomerRow = {
  id: number;
  name: string;
  image?: string | null;
  is_pinned: 0 | 1;
  total: number;
  saleCount: number;
  lastSaleAt: string | null;
};

const EnhancedCustomerDashboard = ({ customers, transactions }: Props) => {
  const [mode, setMode] = useState<ViewMode>("week");
  const [refDate, setRefDate] = useState(dayjs());

  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "background-seconary");
  const textSub = useThemeColor({}, "text-subtitle");
  const iconColor = useThemeColor({}, "icon");
  const gridColor = "#100d0615";

  const colors = {
    revenue: "#487d55",
  };

  const navigate = (direction: "next" | "prev") => {
    setRefDate((prev) =>
      direction === "next" ? prev.add(1, mode) : prev.subtract(1, mode)
    );
  };

  const currentWindowTx = useMemo(() => {
    const start = refDate.startOf(mode);
    const end = refDate.endOf(mode);
    return transactions.filter((t) =>
      dayjs(t.created_at).isBetween(start, end, null, "[]")
    );
  }, [transactions, refDate, mode]);

  const insights = useMemo(() => {
    // only sales linked to customers
    const sales = currentWindowTx.filter(
      (t) => t.type === "sale" && t.customer_id !== null
    );

    const totals: Record<number, number> = {};
    const counts: Record<number, number> = {};
    const lastSale: Record<number, string> = {};

    for (const t of sales) {
      const cid = t.customer_id as number;
      totals[cid] = (totals[cid] || 0) + t.amount;
      counts[cid] = (counts[cid] || 0) + 1;

      const ts = dayjs(t.created_at).toISOString();
      if (!lastSale[cid] || dayjs(ts).isAfter(dayjs(lastSale[cid]))) {
        lastSale[cid] = ts;
      }
    }

    const rows: CustomerRow[] = Object.keys(totals)
      .map((idStr) => {
        const id = Number(idStr);
        const c = customers.find((x) => x.id === id);
        return {
          id,
          name: c?.name ?? `Customer #${id}`,
          image: c?.image ?? null,
          is_pinned: c?.is_pinned ?? 0,
          total: totals[id] || 0,
          saleCount: counts[id] || 0,
          lastSaleAt: lastSale[id] || null,
        };
      })
      .sort((a, b) => b.total - a.total);

    const top = rows[0] ?? null;
    const others = rows.slice(1);

    const totalRevenue = sales.reduce((s, t) => s + t.amount, 0);

    // Extra: also show "best pinned customer" if you want (optional)
    const pinnedRows = rows.filter((r) => r.is_pinned === 1);
    const topPinned = pinnedRows.length ? pinnedRows[0] : null;

    return { top, others, totalRevenue, topPinned };
  }, [currentWindowTx, customers]);

  const chartData = useMemo(() => {
    let intervals: { label: string; start: dayjs.Dayjs; end: dayjs.Dayjs }[] =
      [];

    if (mode === "year") {
      for (let m = 0; m < 12; m++) {
        const d = refDate.month(m);
        intervals.push({
          label: d.format("MMM"),
          start: d.startOf("month"),
          end: d.endOf("month"),
        });
      }
    } else if (mode === "month") {
      const startOfMonth = refDate.startOf("month");
      for (let d = 0; d < refDate.daysInMonth(); d += 7) {
        const s = startOfMonth.add(d, "day");
        let e = s.add(6, "day");
        if (e.isAfter(refDate.endOf("month"))) e = refDate.endOf("month");
        intervals.push({
          label: `W${Math.floor(d / 7) + 1}`,
          start: s,
          end: e,
        });
      }
    } else {
      const startOfWeek = refDate.startOf("week");
      for (let d = 0; d < 7; d++) {
        const date = startOfWeek.add(d, "day");
        intervals.push({
          label: date.format("ddd"),
          start: date.startOf("day"),
          end: date.endOf("day"),
        });
      }
    }

    return intervals.map((interval) => {
      const revenue = transactions
        .filter((t) =>
          dayjs(t.created_at).isBetween(
            interval.start,
            interval.end,
            null,
            "[]"
          )
        )
        .filter((t) => t.type === "sale" && t.customer_id !== null)
        .reduce((s, t) => s + t.amount, 0);

      return {
        label: interval.label,
        stacks: [{ value: revenue, color: colors.revenue }],
      };
    });
  }, [transactions, mode, refDate]);

  const displayTitle = useMemo(() => {
    if (mode === "year") return refDate.format("YYYY");
    if (mode === "month") return refDate.format("MMMM YYYY");
    return `${refDate.startOf("week").format("DD MMM")} - ${refDate
      .endOf("week")
      .format("DD MMM")}`;
  }, [mode, refDate]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <ThemedText type="defaultSemiBold">Customer Analytics</ThemedText>
          <ThemedText style={styles.dateLabel}>{displayTitle}</ThemedText>
        </View>

        <View style={styles.toggle}>
          {(["week", "month", "year"] as ViewMode[]).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => {
                setMode(v);
                setRefDate(dayjs());
              }}
              style={[styles.toggleBtn, mode === v && styles.toggleBtnActive]}
              activeOpacity={0.85}
            >
              <ThemedText
                style={[
                  styles.toggleText,
                  mode === v && { color: "#fff", opacity: 1 },
                ]}
              >
                {v.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FOOTER NAV */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigate("prev")}
          style={styles.navBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={styles.dateLabel}>{displayTitle}</ThemedText>
        <TouchableOpacity
          onPress={() => navigate("next")}
          style={styles.navBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* INSIGHTS */}
      <View style={styles.insightsGrid}>
        {/* TOP CUSTOMER */}
        <View style={[styles.topCard, { backgroundColor: cardBg }]}>
          <View style={styles.avatarContainer}>
            {insights.top?.image ? (
              <Image
                source={{ uri: insights.top.image }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="person-outline" size={24} color="#f59e0b" />
            )}
          </View>

          <View style={styles.topInfo}>
            <View style={styles.toprow}>
              <Ionicons name="star" size={10} color="#f59e0b" />
              <ThemedText style={styles.iLabel}>TOP CUSTOMER</ThemedText>
              {insights.top?.is_pinned === 1 ? (
                <View style={styles.pill}>
                  <Ionicons name="pin" size={10} color="#111" />
                  <ThemedText style={styles.pillText}>Pinned</ThemedText>
                </View>
              ) : null}
            </View>

            <ThemedText style={styles.name} numberOfLines={1}>
              {insights.top?.name || "No Sales Data"}
            </ThemedText>

            <ThemedText style={[styles.small, { color: textSub }]}>
              {insights.top?.saleCount ? `${insights.top.saleCount} sales` : ""}
              {insights.top?.lastSaleAt
                ? ` · last ${dayjs(insights.top.lastSaleAt).format("DD MMM")}`
                : ""}
            </ThemedText>
          </View>

          <View style={styles.topStats}>
            <ThemedText style={styles.money}>
              {CURRENCY_SYMBOL}{" "}
              {Number(insights.top?.total || 0).toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.iLabel}>revenue</ThemedText>
          </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.statsRow}>
          <SummaryCard
            label="Total Revenue"
            value={insights.totalRevenue}
            color={colors.revenue}
            bg={cardBg}
            icon="cash-outline"
          />
          <SummaryCard
            label="Customers"
            value={(insights.top ? 1 : 0) + insights.others.length}
            color={useThemeColor({}, "text")}
            bg={cardBg}
            icon="people-outline"
            isMoney={false}
          />
          <SummaryCard
            label="Top Pinned"
            value={insights.topPinned?.total || 0}
            color="#f59e0b"
            bg={cardBg}
            icon="pin-outline"
          />
        </View>

        {/* OTHER CUSTOMERS */}
        <View style={styles.otherSection}>
          <ThemedText style={styles.sectionTitle}>Other Customers</ThemedText>

          {insights.others.length > 0 ? (
            insights.others.map((c) => (
              <View
                key={c.id}
                style={[styles.rowCard, { backgroundColor: cardBg }]}
              >
                <View style={styles.rowAvatar}>
                  {c.image ? (
                    <Image source={{ uri: c.image }} style={styles.avatar} />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={22}
                      color={iconColor}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ThemedText style={styles.rowName} numberOfLines={1}>
                      {c.name}
                    </ThemedText>
                    {c.is_pinned === 1 ? (
                      <Ionicons name="pin" size={12} color="#f59e0b" />
                    ) : null}
                  </View>

                  <ThemedText style={styles.iLabel}>
                    {c.saleCount} sales
                    {c.lastSaleAt
                      ? ` · last ${dayjs(c.lastSaleAt).format("DD MMM")}`
                      : ""}
                  </ThemedText>
                </View>

                <ThemedText style={styles.rowMoney}>
                  {CURRENCY_SYMBOL} {c.total.toLocaleString()}
                </ThemedText>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No other customers were found
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const SummaryCard = ({
  label,
  value,
  icon,
  color,
  bg,
  isMoney = true,
}: any) => (
  <View style={[styles.iCard, { backgroundColor: bg }]}>
    <View style={styles.iHeader}>
      <Ionicons name={icon} size={12} color={color} />
      <ThemedText style={styles.iLabel} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>

    <ThemedText style={[styles.iValue, { color }]}>
      {isMoney
        ? `${CURRENCY_SYMBOL} ${Number(value || 0).toLocaleString()}`
        : `${value}`}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 14, borderRadius: 28, marginVertical: 0 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  dateLabel: { fontSize: 12, opacity: 0.6 },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#00000008",
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: "#487d55" },
  toggleText: { fontSize: 10, fontWeight: "bold", opacity: 0.6 },

  chartBox: { marginLeft: -15, marginBottom: 10 },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 24,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#00000005",
  },
  navBtn: {
    padding: 8,
    borderRadius: 12,
    width: 42,
    alignItems: "center",
    backgroundColor: "#00000005",
  },
  legend: { flexDirection: "row", gap: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10, textTransform: "capitalize", opacity: 0.7 },

  insightsGrid: { gap: 10 },

  topCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 15,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#00000005",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },

  topInfo: { flex: 1 },
  toprow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },

  iLabel: {
    fontSize: 9,
    opacity: 0.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  name: { fontSize: 17, fontWeight: "bold" },
  small: { fontSize: 11, marginTop: 2, opacity: 0.9 },

  topStats: { alignItems: "flex-end" },
  money: { fontSize: 16, fontWeight: "bold", color: "#487d55" },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f59e0b30",
  },
  pillText: { fontSize: 9, lineHeight: 9, fontWeight: "700", opacity: 0.85 },

  statsRow: { flexDirection: "row", gap: 10 },
  iCard: { flex: 1, paddingTop: 4, paddingHorizontal: 14, borderRadius: 12 },
  iHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  iValue: { fontSize: 14, fontWeight: "bold", marginBottom: 12 },

  otherSection: { marginTop: 10, gap: 8, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.8,
    marginBottom: 4,
    marginLeft: 4,
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#00000005",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  rowName: { fontSize: 14, fontWeight: "600" },
  rowMoney: { fontSize: 14, fontWeight: "bold", opacity: 0.85 },

  emptyContainer: { padding: 20, alignItems: "center", opacity: 0.5 },
  emptyText: { fontSize: 12, fontStyle: "italic" },
});

export default EnhancedCustomerDashboard;
