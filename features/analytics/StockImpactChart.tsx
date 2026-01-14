import React, { useState, useMemo } from "react";
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
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StockLog, ReductionReason, Transaction } from "@/types/customer";
import { Product } from "@/types/stock";
import { Ionicons } from "@expo/vector-icons";
import { CURRENCY_SYMBOL } from "@/utils/currency";

dayjs.extend(isBetween);

type ViewMode = "year" | "month" | "week";
const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  logs: StockLog[];
  transactions: Transaction[];
  products: Product[];
}

const EnhancedStockDashboard = ({ logs, transactions, products }: Props) => {
  const [mode, setMode] = useState<ViewMode>("month");
  const [refDate, setRefDate] = useState(dayjs());

  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "background-seconary");
  const textSub = useThemeColor({}, "text-subtitle");
  const iconColor = useThemeColor({}, "icon");
  const gridColor = "#100d0615";

  const colors = {
    sale: "#487d55",
    expired: "#ef4444",
    waste: "#f59e0b",
  };

  const navigate = (direction: "next" | "prev") => {
    setRefDate((prev) =>
      direction === "next" ? prev.add(1, mode) : prev.subtract(1, mode)
    );
  };

  const currentWindowData = useMemo(() => {
    const start = refDate.startOf(mode);
    const end = refDate.endOf(mode);
    const filteredLogs = logs.filter((l) =>
      dayjs(l.created_at).isBetween(start, end, null, "[]")
    );
    const filteredTx = transactions.filter((t) =>
      dayjs(t.created_at).isBetween(start, end, null, "[]")
    );
    return { filteredLogs, filteredTx };
  }, [logs, transactions, refDate, mode]);

  const insights = useMemo(() => {
    const { filteredLogs, filteredTx } = currentWindowData;

    const counts: Record<number, number> = {};
    filteredLogs
      .filter((l) => l.reason === "sale")
      .forEach((l) => {
        counts[l.product_id] = (counts[l.product_id] || 0) + l.quantity;
      });

    const sortedProductIds = Object.keys(counts).sort(
      (a, b) => counts[Number(b)] - counts[Number(a)]
    );

    const topId = sortedProductIds[0] || "0";
    const topProductMeta = products.find((p) => p.id === Number(topId));

    // Calculate other products sold (excluding the top one)
    const otherProducts = sortedProductIds.slice(1).map((id) => {
      const product = products.find((p) => p.id === Number(id));
      const qty = counts[Number(id)];
      return {
        ...product,
        qty,
        totalRevenue: qty * (product?.price || 0),
      };
    });

    const unitsSold = filteredLogs
      .filter((l) => l.reason === "sale")
      .reduce((s, c) => s + c.quantity, 0);
    const wasteCount = filteredLogs
      .filter((l) => l.reason === "waste" || l.reason === "expired")
      .reduce((s, c) => s + c.quantity, 0);

    const dateRev: Record<string, number> = {};
    filteredTx
      .filter((t) => t.type === "sale")
      .forEach((t) => {
        const d = dayjs(t.created_at).format("YYYY-MM-DD");
        dateRev[d] = (dateRev[d] || 0) + t.amount;
      });
    const peakD = Object.keys(dateRev).reduce(
      (a, b) => (dateRev[a] > dateRev[b] ? a : b),
      ""
    );

    return {
      topProduct: topProductMeta || null,
      topQty: counts[Number(topId)] || 0,
      topRevenue: (counts[Number(topId)] || 0) * (topProductMeta?.price || 0),
      otherProducts,
      unitsSold,
      wasteCount,
      peakDate: peakD ? dayjs(peakD).format("DD MMM") : "N/A",
    };
  }, [currentWindowData, products]);

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
      const inPeriod = logs.filter((l) =>
        dayjs(l.created_at).isBetween(interval.start, interval.end, null, "[]")
      );
      const getSum = (r: ReductionReason) =>
        inPeriod
          .filter((l) => l.reason === r)
          .reduce((s, c) => s + c.quantity, 0);
      return {
        label: interval.label,
        stacks: [
          { value: getSum("sale"), color: colors.sale },
          { value: getSum("expired"), color: colors.expired },
          { value: getSum("waste"), color: colors.waste },
        ],
      };
    });
  }, [logs, mode, refDate]);

  const displayTitle = useMemo(() => {
    if (mode === "year") return refDate.format("YYYY");
    if (mode === "month") return refDate.format("MMMM YYYY");
    return `${refDate.startOf("week").format("DD MMM")} - ${refDate
      .endOf("week")
      .format("DD MMM")}`;
  }, [mode, refDate]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="defaultSemiBold">Stock Analytics</ThemedText>
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
            >
              <ThemedText
                style={[styles.toggleText, mode === v && { color: "#fff" }]}
              >
                {v.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartBox}>
        <BarChart
          stackData={chartData}
          height={180}
          width={SCREEN_WIDTH - 80}
          barWidth={mode === "year" ? 12 : 22}
          spacing={mode === "year" ? 10 : 20}
          initialSpacing={15}
          noOfSections={4}
          rulesColor={gridColor}
          xAxisColor={gridColor}
          yAxisThickness={0}
          xAxisThickness={1}
          yAxisTextStyle={{ color: textSub, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: textSub, fontSize: 9 }}
          disablePress
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigate("prev")}
          style={styles.navBtn}
        >
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </TouchableOpacity>
        <View style={styles.legend}>
          {Object.entries(colors).map(([key, color]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <ThemedText style={styles.legendText}>{key}</ThemedText>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => navigate("next")}
          style={styles.navBtn}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.insightsGrid}>
        {/* ROW 1: TOP PRODUCT */}
        <View style={[styles.topProductCard, { backgroundColor: cardBg }]}>
          <View style={styles.avatarContainer}>
            {insights.topProduct?.image ? (
              <Image
                source={{ uri: insights.topProduct.image }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="cube-outline" size={24} color="#f59e0b" />
            )}
          </View>
          <View style={styles.topInfo}>
            <View style={styles.toprow}>
              <Ionicons name="star" size={10} color="#f59e0b" />
              <ThemedText style={[styles.iLabel]}>TOP PRODUCT</ThemedText>
            </View>
            <ThemedText style={styles.productName} numberOfLines={1}>
              {insights.topProduct?.title || "No Sales Data"}
            </ThemedText>
          </View>
          <View style={styles.topStats}>
            <ThemedText style={styles.soldQty}>{insights.topQty}</ThemedText>
            <ThemedText style={styles.iLabel}>
              {CURRENCY_SYMBOL} {insights.topRevenue.toLocaleString()}
            </ThemedText>
          </View>
        </View>

        {/* ROW 2: SUMMARY STATS */}
        <View style={styles.statsRow}>
          <InsightCard
            label="Total Sold"
            value={insights.unitsSold}
            icon="cart"
            color={colors.sale}
            bg={cardBg}
          />
          <InsightCard
            label="Waste/Exp"
            value={insights.wasteCount}
            icon="trash"
            color={colors.expired}
            bg={cardBg}
          />
          <InsightCard
            label="Peak Date"
            value={insights.peakDate}
            icon="trending-up"
            color="#3b82f6"
            bg={cardBg}
          />
        </View>

        {/* NEW SECTION: OTHER PRODUCTS SOLD */}
        <View style={styles.otherSection}>
          <ThemedText style={styles.sectionTitle}>
            Other Selling Products
          </ThemedText>
          {insights.otherProducts.length > 0 ? (
            insights.otherProducts.map((prod, index) => (
              <View
                key={index}
                style={[styles.otherProductCard, { backgroundColor: cardBg }]}
              >
                <View style={styles.otherAvatarContainer}>
                  {prod.image ? (
                    <Image source={{ uri: prod.image }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="cube-outline" size={20} color={iconColor} />
                  )}
                </View>
                <View style={styles.topInfo}>
                  <ThemedText style={styles.otherProductName} numberOfLines={1}>
                    {prod.title}
                  </ThemedText>
                  <ThemedText style={styles.iLabel}>
                    {prod.qty} Units Sold
                  </ThemedText>
                </View>
                <View style={styles.topStats}>
                  <ThemedText style={styles.otherPriceText}>
                    {CURRENCY_SYMBOL} {prod.totalRevenue?.toLocaleString()}
                  </ThemedText>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No other products were sold
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const InsightCard = ({ label, value, icon, color, bg }: any) => (
  <View style={[styles.iCard, { backgroundColor: bg }]}>
    <View style={styles.iHeader}>
      <Ionicons name={icon} size={12} color={color} />
      <ThemedText style={styles.iLabel} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
    <ThemedText style={[styles.iValue, { color }]}>{value}</ThemedText>
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
    justifyContent: "space-between",
    marginBottom: 20,
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

  // Insights Grid
  insightsGrid: { gap: 10 },
  topProductCard: {
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
    backgroundColor: "#f59e0b15",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  topInfo: { flex: 1 },
  productName: { fontSize: 17, fontWeight: "bold" },
  topStats: { alignItems: "flex-end" },
  soldQty: { fontSize: 20, fontWeight: "bold", color: "#487d55" },

  statsRow: { flexDirection: "row", gap: 10 },
  iCard: { flex: 1, paddingTop: 4, paddingHorizontal: 14, borderRadius: 12 },
  iHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  toprow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  iLabel: {
    fontSize: 9,
    opacity: 0.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  iValue: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },

  // Other Products Section
  otherSection: { marginTop: 10, gap: 8, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.8,
    marginBottom: 4,
    marginLeft: 4,
  },
  otherProductCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  otherAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#00000005",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  otherProductName: { fontSize: 14, fontWeight: "600" },
  otherPriceText: { fontSize: 14, fontWeight: "bold", opacity: 0.8 },
  emptyContainer: { padding: 20, alignItems: "center", opacity: 0.5 },
  emptyText: { fontSize: 12, fontStyle: "italic" },
});

export default EnhancedStockDashboard;
