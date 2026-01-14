// app/(tabs)/products/customer/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { BarChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { ThemedView, ThemedText, EditableField } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import type {
  Customer,
  Transaction,
  StockLog,
  ReductionReason,
} from "@/types/customer";
import { useStock } from "@/contexts/StockContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { CURRENCY_SYMBOL } from "@/utils/currency";

dayjs.extend(isBetween);

const SCREEN_WIDTH = Dimensions.get("window").width;

type ViewMode = "year" | "month" | "week";

export default function CustomerDetailsPage() {
  const params = useLocalSearchParams<{ id: string }>();
  const customerId = Number(params.id);

  const { controller, refreshCustomers } = useStock();

  const bgSecondary = useThemeColor({}, "background-seconary");
  const highlight = useThemeColor({}, "highlight")
  const bgPrimary = useThemeColor({}, "background-muted");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await controller.getCustomerById(customerId);
        if (!mounted) return;
        setCustomer(data || null);
      } catch (e) {
        console.error("Failed to load customer:", e);
        if (mounted) setCustomer(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [customerId, controller]);

  const initialLetter = useMemo(() => {
    const n = customer?.name?.trim();
    return n ? n[0].toUpperCase() : "?";
  }, [customer?.name]);

  const phoneAvailable = !!customer?.phone && customer.phone.trim().length > 0;

  const handleCall = async () => {
    if (!customer?.phone) return;

    const cleaned = customer.phone.replace(/[^\d+]/g, "");
    const url = `tel:${cleaned}`;

    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("Can't place call", "Your device can't open the dialer.");
      return;
    }
    Linking.openURL(url);
  };

  const saveField = async (field: keyof Customer, value: any) => {
    if (!customer) return;

    try {
      await controller.updateCustomerField(customer.id, field, value);
      setCustomer((prev) => (prev ? { ...prev, [field]: value } : prev));
      await refreshCustomers();
    } catch (e) {
      console.error("Customer update failed:", e);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.screen}>
        <Stack.Screen options={{ title: "Customer" }} />
        <ThemedText style={{ opacity: 0.6 }}>Loading…</ThemedText>
      </ThemedView>
    );
  }

  if (!customer) {
    return (
      <ThemedView style={styles.screen}>
        <Stack.Screen options={{ title: "Customer" }} />
        <ThemedText style={{ opacity: 0.6 }}>Customer not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: "Customer", headerShown: false }} />

      {/* Floating Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.75}
      >
        <BlurView intensity={60} tint="dark" style={styles.backBlur}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </BlurView>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER CARD */}
        <ThemedView
          style={[styles.headerCard, { backgroundColor: bgSecondary }]}
        >
          <View style={styles.avatarWrap}>
            {customer.image ? (
              <Image
                source={{ uri: customer.image }}
                style={styles.avatarImg}
              />
            ) : (
              <View
                style={[styles.avatarFallback, { backgroundColor: highlight }]}
              >
                <ThemedText style={styles.avatarLetter}>
                  {initialLetter}
                </ThemedText>
              </View>
            )}
          </View>

          <View style={{ flex: 1, gap: 6 }}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <EditableField
              value={customer.name}
              onSave={(val) => saveField("name", val)}
              textStyle={styles.valueText}
            />

            <ThemedText style={styles.label}>Email</ThemedText>
            <EditableField
              value={customer.email || "Add email"}
              onSave={(val) => saveField("email", val)}
              textStyle={styles.valueText}
            />
          </View>
        </ThemedView>

        {/* PHONE CARD */}
        <ThemedView style={[styles.card, { backgroundColor: bgSecondary }]}>
          <View style={styles.cardTopRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.title}>Phone</ThemedText>
              <ThemedText style={styles.sub}>
                {phoneAvailable ? "Tap call to dial" : "No phone number yet"}
              </ThemedText>
            </View>

            <TouchableOpacity
              disabled={!phoneAvailable}
              onPress={handleCall}
              style={[
                styles.callBtn,
                {
                  backgroundColor: phoneAvailable
                    ? bgPrimary
                    : "rgba(0,0,0,0.08)",
                },
              ]}
              activeOpacity={0.85}
            >
              <Ionicons
                name="call-outline"
                size={18}
                color={phoneAvailable ? "#fff" : "rgba(0,0,0,0.35)"}
              />
              <ThemedText
                style={[
                  styles.callText,
                  { color: phoneAvailable ? "#fff" : "rgba(0,0,0,0.35)" },
                ]}
              >
                Call
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons
              name="phone-portrait-outline"
              size={18}
              color={"rgba(0,0,0,0.55)"}
            />
            <EditableField
              value={customer.phone || "Add phone number"}
              onSave={(val) => saveField("phone", val)}
              textStyle={styles.phoneValue}
            />
          </View>
        </ThemedView>

        {/* ANALYTICS */}
        <CustomerPurchaseAnalytics customerId={customerId} />
      </ScrollView>
    </ThemedView>
  );
}

/* ------------------------------- Analytics ------------------------------- */

function CustomerPurchaseAnalytics({ customerId }: { customerId: number }) {
  const { transactions, stockLogs } = useTransactions();
  const { products } = useStock();

  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "background-seconary");
  const textSub = useThemeColor({}, "text-subtitle");
  const iconColor = useThemeColor({}, "icon");
  const gridColor = "#100d0615";

  const [mode, setMode] = useState<ViewMode>("month");
  const [refDate, setRefDate] = useState(dayjs());

  const revenueColor = "#487d55";

  const navigate = (direction: "next" | "prev") => {
    setRefDate((prev) =>
      direction === "next" ? prev.add(1, mode) : prev.subtract(1, mode)
    );
  };

  const currentWindowTx = useMemo(() => {
    const start = refDate.startOf(mode);
    const end = refDate.endOf(mode);

    return transactions.filter((t) => {
      if (t.type !== "sale") return false;
      if (t.customer_id !== customerId) return false;
      return dayjs(t.created_at).isBetween(start, end, null, "[]");
    });
  }, [transactions, refDate, mode, customerId]);

  const currentWindowLog = useMemo(() => {
    // stock logs linked to the customer's sale tx ids
    const txIdSet = new Set(currentWindowTx.map((t) => t.id));

    return stockLogs.filter((l) => {
      if (l.reason !== "sale") return false;
      if (!l.transaction_id) return false;
      return txIdSet.has(l.transaction_id);
    });
  }, [stockLogs, currentWindowTx]);

  const insights = useMemo(() => {
    const totalRevenue = currentWindowTx.reduce((s, t) => s + t.amount, 0);
    const purchaseCount = currentWindowTx.length;

    const totalPackets = currentWindowLog.reduce((s, l) => s + l.quantity, 0);

    // Most bought product (by quantity)
    const qtyByProduct: Record<number, number> = {};
    for (const l of currentWindowLog) {
      qtyByProduct[l.product_id] =
        (qtyByProduct[l.product_id] || 0) + l.quantity;
    }

    const topProductId =
      Number(
        Object.keys(qtyByProduct).sort(
          (a, b) => qtyByProduct[Number(b)] - qtyByProduct[Number(a)]
        )[0]
      ) || 0;

    const topProductQty = topProductId ? qtyByProduct[topProductId] : 0;
    const topProductTitle =
      products.find((p) => p.id === topProductId)?.title || "N/A";

    // Average per time unit (based on mode)
    let avgLabel = "Avg / period";
    let denom = 1;

    if (mode === "week") {
      avgLabel = "Avg / day";
      denom = 7;
    } else if (mode === "month") {
      avgLabel = "Avg / day";
      denom = refDate.daysInMonth();
    } else {
      avgLabel = "Avg / month";
      denom = 12;
    }

    const avgPerUnit = denom > 0 ? totalRevenue / denom : 0;

    return {
      totalRevenue,
      purchaseCount,
      totalPackets,
      topProductTitle,
      topProductQty,
      avgPerUnit,
      avgLabel,
    };
  }, [currentWindowTx, currentWindowLog, products, mode, refDate]);

  const chartData = useMemo(() => {
    // revenue chart for THIS customer only
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
        .filter((t) => t.type === "sale" && t.customer_id === customerId)
        .filter((t) =>
          dayjs(t.created_at).isBetween(
            interval.start,
            interval.end,
            null,
            "[]"
          )
        )
        .reduce((s, t) => s + t.amount, 0);

      return {
        label: interval.label,
        stacks: [{ value: revenue, color: revenueColor }],
      };
    });
  }, [transactions, mode, refDate, customerId]);

  const displayTitle = useMemo(() => {
    if (mode === "year") return refDate.format("YYYY");
    if (mode === "month") return refDate.format("MMMM YYYY");
    return `${refDate.startOf("week").format("DD MMM")} - ${refDate
      .endOf("week")
      .format("DD MMM")}`;
  }, [mode, refDate]);

  return (
    <View style={[aStyles.container, { backgroundColor: bgColor }]}>
      <View style={aStyles.header}>
        <View>
          <ThemedText type="defaultSemiBold">Customer Analytics</ThemedText>
          <ThemedText style={aStyles.dateLabel}>{displayTitle}</ThemedText>
        </View>

        <View style={aStyles.toggle}>
          {(["week", "month", "year"] as ViewMode[]).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => {
                setMode(v);
                setRefDate(dayjs());
              }}
              style={[aStyles.toggleBtn, mode === v && aStyles.toggleBtnActive]}
              activeOpacity={0.85}
            >
              <ThemedText
                style={[
                  aStyles.toggleText,
                  mode === v && { color: "#fff", opacity: 1 },
                ]}
              >
                {v.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={aStyles.footer}>
        <TouchableOpacity
          onPress={() => navigate("prev")}
          style={aStyles.navBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </TouchableOpacity>

        <ThemedText style={aStyles.dateLabel}>{displayTitle}</ThemedText>

        <TouchableOpacity
          onPress={() => navigate("next")}
          style={aStyles.navBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* GRID */}
      <View style={aStyles.grid}>
        <StatCard
          label="Total Purchases"
          value={`${CURRENCY_SYMBOL} ${insights.totalRevenue.toLocaleString()}`}
          icon="cash-outline"
          bg={cardBg}
          color={revenueColor}
        />
        <StatCard
          label="Total Packets"
          value={`${insights.totalPackets}`}
          icon="cube-outline"
          bg={cardBg}
          color={useThemeColor({}, "text")}
        />
        <StatCard
          label="Most Bought"
          value={insights.topProductTitle}
          sub={
            insights.topProductQty
              ? `${insights.topProductQty} units`
              : undefined
          }
          icon="star-outline"
          bg={cardBg}
          color="#f59e0b"
        />
      </View>
    </View>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  bg,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  bg: string;
  color: string;
}) {
  return (
    <View style={[aStyles.card, { backgroundColor: bg }]}>
      <View style={aStyles.cardTop}>
        <Ionicons name={icon} size={14} color={color} />
        <ThemedText style={aStyles.cardLabel} numberOfLines={1}>
          {label}
        </ThemedText>
      </View>

      <ThemedText style={[aStyles.cardValue, { color }]} numberOfLines={1}>
        {value}
      </ThemedText>

      {sub ? <ThemedText style={aStyles.cardSub}>{sub}</ThemedText> : null}
    </View>
  );
}

/* ------------------------------- Styles ------------------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 44, paddingBottom: 120 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 90,
    gap: 16,
  },

  backBtn: {
    position: "absolute",
    top: 54,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    zIndex: 50,
  },
  backBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  avatarWrap: { width: 72, height: 72, borderRadius: 36, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
  },
  avatarLetter: { fontSize: 28, fontWeight: "800", color: "#fff" },

  label: { fontSize: 13, fontWeight: "700", opacity: 0.5, marginTop: 2 },
  valueText: { fontSize: 16, fontWeight: "700", opacity: 0.9 },

  card: {
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 12, opacity: 0.55 },

  callBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  callText: { fontWeight: "800" },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  phoneValue: { fontSize: 14, fontWeight: "700", opacity: 0.85 },
});

const aStyles = StyleSheet.create({
  container: { padding: 4, borderRadius: 22 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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

  chartBox: { marginLeft: -10, marginBottom: 8 },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingTop: 10,
    marginBottom: 12,
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

  grid: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "48%", padding: 12, borderRadius: 16 },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardValue: { fontSize: 14, fontWeight: "800" },
  cardSub: { fontSize: 11, opacity: 0.6, marginTop: 4 },
});
