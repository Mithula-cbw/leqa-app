import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/shared";
import { Transaction } from "@/types/customer";
import { useThemeColor } from "@/hooks/use-theme-color";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SCREEN_WIDTH = Dimensions.get("window").width;
const STORAGE_KEY = "@user_chart_start_date";

interface Props {
  transactions: Transaction[];
}

const CumulativeFinancialChart = ({ transactions }: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Theme Hooks
  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "background-seconary");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const textSubColor = useThemeColor({}, "text-subtitle");
  const accent = useThemeColor({}, "accent");
  const salesColor = "#487d55";

  // --- Persistence Logic ---
  useEffect(() => {
    const init = async () => {
      try {
        const savedDate = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedDate) setStartDate(new Date(savedDate));
      } catch (e) {
        console.error("Storage Error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const saveDate = async (date: Date) => {
    setStartDate(date);
    await AsyncStorage.setItem(STORAGE_KEY, date.toISOString());
    setDatePickerVisibility(false);
  };

  const clearDate = async () => {
    setStartDate(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  // --- Data Processing ---
  const { chartData, totals } = useMemo(() => {
    if (!startDate) return { chartData: null, totals: null };
    return processCumulativeData(transactions, dayjs(startDate));
  }, [transactions, startDate]);

  // 1. Loading state (prevents button flickering)
  if (isLoading) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="small" color={accent} />
      </View>
    );
  }

  // 2. Empty state (No date picked yet)
  if (!startDate) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: bgColor }]}>
        <ThemedText style={styles.emptyTitle}>Growth Tracking</ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: textSubColor }]}>
          Choose a start date to begin tracking your cumulative financial
          progress.
        </ThemedText>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: accent }]}
          onPress={() => setDatePickerVisibility(true)}
        >
          <ThemedText style={{ fontWeight: "bold", color: "#000" }}>
            Pick a Start Date
          </ThemedText>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={saveDate}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>
    );
  }

  // 3. Main Chart & Grid View
  return (
    <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.chartTitle, { color: textColor }]}>
            Performance Grid
          </ThemedText>
          <ThemedText style={{ fontSize: 11, color: textSubColor }}>
            Data since {dayjs(startDate).format("DD MMM YYYY")}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={styles.calBtn} onPress={clearDate}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calBtn}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Ionicons name="calendar" size={18} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          areaChart
          data={chartData!.sales}
          data2={chartData!.expenses}
          height={160}
          width={SCREEN_WIDTH - 50}
          curved={false} // Prevents "diving" lines
          initialSpacing={10}
          endSpacing={10}
          spacing={(SCREEN_WIDTH - 100) / (chartData!.sales.length - 1)}
          maxValue={chartData!.maxValue * 1.1}
          hideYAxisText
          yAxisColor="transparent"
          xAxisColor={textSubColor + "20"}
          xAxisLabelTextStyle={{ color: textSubColor, fontSize: 9 }}
          thickness={2.5}
          color1={salesColor}
          startFillColor1={salesColor}
          color2={accent}
          startFillColor2={accent}
          startOpacity={0.15}
          endOpacity={0.01}
          hideDataPoints
        />
      </View>

      <View style={styles.grid}>
        <SummaryCard
          label="Revenue"
          value={totals!.revenue}
          color={salesColor}
          bgColor={cardBg}
          icon="cash-outline"
        />
        <SummaryCard
          label="Expenses"
          value={totals!.expenses}
          color="#ef4444"
          bgColor={cardBg}
          icon="cart-outline"
        />
        <SummaryCard
          label="Net Profit"
          value={totals!.revenue - totals!.expenses}
          color={textColor}
          bgColor={cardBg}
          icon="pie-chart-outline"
        />
        <SummaryCard
          label="Waste/Misc"
          value={totals!.waste}
          color="#ef4444"
          bgColor={cardBg}
          icon="alert-circle-outline"
        />
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={saveDate}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

// --- Sub-components ---

const SummaryCard = ({ label, value, color, bgColor, icon }: any) => (
  <View style={[styles.gridItem, { backgroundColor: bgColor }]}>
    <View style={styles.cardHeader}>
      <Ionicons name={icon} size={14} color={color} />
      <ThemedText style={styles.gridLabel}>{label}</ThemedText>
    </View>
    <ThemedText style={[styles.gridValue, { color }]}>
      {value < 0
        ? `-$${Math.abs(value).toLocaleString()}`
        : `$${value.toLocaleString()}`}
    </ThemedText>
  </View>
);

// --- Helper Functions ---

function processCumulativeData(
  transactions: Transaction[],
  start: dayjs.Dayjs
) {
  const today = dayjs();
  const diffDays = Math.max(1, today.diff(start, "day"));
  const intervalCount = 8;
  const step = Math.max(1, Math.floor(diffDays / intervalCount));

  // Filter only transactions within selected range
  const filtered = transactions.filter(
    (t) =>
      dayjs(t.created_at).isAfter(start, "day") ||
      dayjs(t.created_at).isSame(start, "day")
  );

  const salesData: any[] = [];
  const expenseData: any[] = [];

  for (let i = 0; i <= diffDays; i += step) {
    const currentDate = start.add(i, "day");
    const historyAtPoint = filtered.filter(
      (t) =>
        dayjs(t.created_at).isBefore(currentDate, "day") ||
        dayjs(t.created_at).isSame(currentDate, "day")
    );

    const s = historyAtPoint
      .filter((t) => t.type === "sale")
      .reduce((acc, t) => acc + t.amount, 0);
    const e = historyAtPoint
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    salesData.push({
      value: s,
      label: i % (step * 2) === 0 ? currentDate.format("DD/MM") : "",
    });
    expenseData.push({ value: e });
  }

  const revenue = filtered
    .filter((t) => t.type === "sale")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const waste = filtered
    .filter((t) => t.type === "other_income" && t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return {
    chartData: {
      sales: salesData,
      expenses: expenseData,
      maxValue:
        Math.max(
          ...salesData.map((d) => d.value),
          ...expenseData.map((d) => d.value)
        ) || 100,
    },
    totals: { revenue, expenses, waste },
  };
}

const styles = StyleSheet.create({
  cardContainer: { borderRadius: 24, padding: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold" },
  calBtn: { padding: 8, backgroundColor: "#100d0615", borderRadius: 10 },
  chartWrapper: { marginLeft: -15, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridItem: { width: "48.5%", padding: 12, borderRadius: 16 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  gridLabel: { fontSize: 10, opacity: 0.7, fontWeight: "600" },
  gridValue: { fontSize: 20, marginLeft: 2, fontWeight: "bold" },
  emptyContainer: {
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    minHeight: 220,
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  primaryBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
});

export default CumulativeFinancialChart;
