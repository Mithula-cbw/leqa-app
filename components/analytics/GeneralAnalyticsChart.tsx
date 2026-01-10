import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
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

  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const textSubColor = useThemeColor({}, "text-subtitle");
  const accent = useThemeColor({}, "accent");
  const salesColor = "#487d55";
  const cardBg = "#100d0610";

  useEffect(() => {
    (async () => {
      const savedDate = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDate) setStartDate(new Date(savedDate));
    })();
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

  // Logic is now centralized so cards and charts always match the picked date
  const { chartData, totals } = useMemo(() => {
    if (!startDate) return { chartData: null, totals: null };
    return processCumulativeData(transactions, dayjs(startDate));
  }, [transactions, startDate]);

  if (!startDate) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: bgColor }]}>
        <ThemedText style={styles.emptyTitle}>Growth Tracking</ThemedText>
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
            <Ionicons name="calendar" size={18} color={accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          areaChart
          data={chartData!.sales}
          data2={chartData!.expenses}
          height={160}
          width={SCREEN_WIDTH - 80}
          curved={false} // Straight lines to prevent diving
          initialSpacing={10}
          endSpacing={10}
          spacing={(SCREEN_WIDTH - 100) / (chartData!.sales.length - 1)}
          maxValue={chartData!.maxValue * 1.1}
          hideYAxisText
          yAxisColor="transparent"
          xAxisColor={textSubColor + "20"}
          xAxisLabelTextStyle={{ color: textSubColor, fontSize: 9 }}
          thickness={2}
          color1={salesColor}
          startFillColor1={salesColor}
          color2={accent}
          startFillColor2={accent}
          startOpacity={0.15}
          endOpacity={0.01}
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
          color={accent}
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

function processCumulativeData(
  transactions: Transaction[],
  start: dayjs.Dayjs
) {
  const today = dayjs();
  const diffDays = Math.max(1, today.diff(start, "day"));
  const intervalCount = 8;
  const step = Math.max(1, Math.floor(diffDays / intervalCount));

  // Only consider transactions from the picked date onwards
  const filteredTransactions = transactions.filter(
    (t) =>
      dayjs(t.created_at).isAfter(start, "day") ||
      dayjs(t.created_at).isSame(start, "day")
  );

  const salesData: any[] = [];
  const expenseData: any[] = [];

  for (let i = 0; i <= diffDays; i += step) {
    const currentDate = start.add(i, "day");

    const historyAtPoint = filteredTransactions.filter(
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

  // Calculate final totals from the filtered set
  const revenue = filteredTransactions
    .filter((t) => t.type === "sale")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  // Waste is defined as "other_income" that is negative (adjustments/losses)
  const waste = filteredTransactions
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
  cardContainer: { borderRadius: 24, padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold" },
  calBtn: { padding: 8, backgroundColor: "#100d0615", borderRadius: 10 },
  chartWrapper: { marginLeft: -15, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%", padding: 12, borderRadius: 16 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  gridLabel: { fontSize: 10, opacity: 0.7, fontWeight: "600" },
  gridValue: { fontSize: 15, fontWeight: "bold" },
  emptyContainer: {
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    minHeight: 200,
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  primaryBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
});

export default CumulativeFinancialChart;
