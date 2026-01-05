// Leqa © 2026 Mithula Chanthuka
import React, { useState, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { Transaction } from "@/types/customer";
import { useThemeColor } from "@/hooks/use-theme-color";

const SCREEN_WIDTH = Dimensions.get("window").width;

export type TimeFrame = "1W" | "1M" | "1Y";
// Added your TransactionType
export type TransactionType = "sale" | "expense" | "other_income";

interface Props {
  transactions: Transaction[];
}

const GeneralAnalyticsChart = ({ transactions }: Props) => {
  // Theme Hooks
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const textSubColor = useThemeColor({}, "text-subtitle");
  const accent = useThemeColor({}, "accent");
  const salesColor = "#487d55";
  const otherIncomeColor = "#93C5FD"; // Soft blue for other income

  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1W");
  const [referenceDate, setReferenceDate] = useState(dayjs());

  const navigateTime = (direction: "back" | "forward") => {
    const amount = direction === "back" ? -1 : 1;
    const unit =
      timeFrame === "1W" ? "week" : timeFrame === "1M" ? "month" : "year";
    setReferenceDate((prev) => prev.add(amount, unit as any));
  };

  const chartData = useMemo(() => {
    return processTransactionData(transactions, timeFrame, referenceDate);
  }, [transactions, timeFrame, referenceDate]);

  const formatValue = (val: number) =>
    val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val}`;

  return (
    <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.chartTitle, { color: textColor }]}>
          Financial Trends
        </ThemedText>
        <View
          style={[
            styles.timeFrameContainer,
            { backgroundColor: "#100d0622", borderRadius: 8 },
          ]}
        >
          {(["1W", "1M", "1Y"] as TimeFrame[]).map((tf) => (
            <TouchableOpacity
              key={tf}
              onPress={() => {
                setTimeFrame(tf);
                setReferenceDate(dayjs());
              }}
              style={[
                styles.timeBtn,
                timeFrame === tf && { backgroundColor: accent },
              ]}
            >
              <ThemedText
                style={[
                  styles.timeText,
                  timeFrame === tf
                    ? { color: "#000" }
                    : { color: textSubColor },
                ]}
              >
                {tf}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Paging Controls */}
      <View style={styles.pagingRow}>
        <TouchableOpacity
          onPress={() => navigateTime("back")}
          style={styles.arrowBtn}
        >
          <Ionicons name="chevron-back" size={18} color={accent} />
        </TouchableOpacity>
        <ThemedText style={[styles.dateRangeText, { color: textSubColor }]}>
          {chartData.rangeLabel}
        </ThemedText>
        <TouchableOpacity
          onPress={() => navigateTime("forward")}
          style={styles.arrowBtn}
        >
          <Ionicons name="chevron-forward" size={18} color={accent} />
        </TouchableOpacity>
      </View>

      {/* Chart Section */}
      <View style={styles.chartWrapper}>
        <LineChart
          areaChart
          curved
          data={chartData.sales}
          data2={chartData.expenses}
          data3={chartData.otherIncome} // Added data3
          height={180}
          width={SCREEN_WIDTH - 40}
          initialSpacing={30}
          endSpacing={20}
          spacing={timeFrame === "1M" ? 25 : 50}
          maxValue={chartData.maxValue * 1.3}
          thickness={3}
          hideDataPoints
          curvature={0.2}
          curveType={1}
          // Color 1 (Sales)
          color1={salesColor}
          startFillColor1={salesColor}
          startOpacity1={0.3}
          endOpacity1={0.01}
          // Color 2 (Expenses / Accent)
          color2={accent}
          startFillColor2={accent}
          startOpacity2={0.2}
          endOpacity2={0.01}
          // Color 3 (Other Income)
          color3={otherIncomeColor}
          startFillColor3={otherIncomeColor}
          startOpacity3={0.15}
          endOpacity3={0.01}
          // Grid & Axes
          rulesType="solid"
          rulesColor="rgba(255,255,255,0.05)"
          yAxisColor="transparent"
          xAxisColor="rgba(255,255,255,0.05)"
          hideYAxisText
          xAxisLabelTextStyle={[styles.xAxisText, { color: textSubColor }]}
          pointerConfig={{
            pointerStripColor: accent + "50",
            pointerStripWidth: 2,
            pointerColor: accent,
            radius: 4,
            pointerLabelComponent: (items: any) => (
              <View
                style={[
                  styles.tooltipContainer,
                  { backgroundColor: bgColor, borderColor: accent + "30" },
                ]}
              >
                <ThemedText
                  style={[styles.tooltipLabel, { color: textSubColor }]}
                >
                  {items[0].label}
                </ThemedText>
                <ThemedText
                  style={[styles.tooltipValue, { color: salesColor }]}
                >
                  Sales: {formatValue(items[0].value)}
                </ThemedText>
                <ThemedText style={[styles.tooltipValue, { color: accent }]}>
                  Exp: {formatValue(items[1].value)}
                </ThemedText>
                <ThemedText
                  style={[styles.tooltipValue, { color: otherIncomeColor }]}
                >
                  Other: {formatValue(items[2].value)}
                </ThemedText>
              </View>
            ),
          }}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <LegendItem label="Sales" color={salesColor} textColor={textSubColor} />
        <LegendItem label="Expenses" color={accent} textColor={textSubColor} />
        <LegendItem
          label="Other"
          color={otherIncomeColor}
          textColor={textSubColor}
        />
      </View>
    </View>
  );
};

// --- Helper Functions ---

function processTransactionData(
  transactions: Transaction[],
  timeframe: TimeFrame,
  refDate: dayjs.Dayjs
) {
  let startDate = refDate;
  let unit: "day" | "month" = "day";
  let iterations = 7;

  if (timeframe === "1W") {
    startDate = refDate.startOf("week");
    iterations = 7;
  } else if (timeframe === "1M") {
    startDate = refDate.startOf("month");
    iterations = refDate.daysInMonth();
  } else {
    startDate = refDate.startOf("year");
    unit = "month";
    iterations = 12;
  }

  const groups: any[] = [];
  let currentMax = 0;

  for (let i = 0; i < iterations; i++) {
    const current = startDate.add(i, unit);
    let label = "";
    if (i === 0 || i === Math.floor(iterations / 2) || i === iterations - 1) {
      label = current.format(unit === "day" ? "DD MMM" : "MMM");
    }

    const totals = transactions.reduce(
      (acc, t) => {
        if (dayjs(t.created_at).isSame(current, unit)) {
          // Type casting safety
          const type = t.type as TransactionType;
          if (type === "sale") acc.sale += t.amount;
          else if (type === "expense") acc.expense += t.amount;
          else if (type === "other_income") acc.other_income += t.amount;
        }
        return acc;
      },
      { sale: 0, expense: 0, other_income: 0 }
    );

    currentMax = Math.max(
      currentMax,
      totals.sale,
      totals.expense,
      totals.other_income
    );
    groups.push({ label, ...totals });
  }

  const rangeLabel =
    timeframe === "1Y"
      ? startDate.format("YYYY")
      : `${startDate.format("MMM D")} - ${startDate
          .add(iterations - 1, unit)
          .format("MMM D, YYYY")}`;

  return {
    rangeLabel,
    maxValue: currentMax || 100,
    sales: groups.map((g) => ({ value: g.sale, label: g.label })),
    expenses: groups.map((g) => ({ value: g.expense })),
    otherIncome: groups.map((g) => ({ value: g.other_income })),
  };
}

const LegendItem = ({ label, color, textColor }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <ThemedText style={[styles.legendLabel, { color: textColor }]}>
      {label}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    paddingVertical: 20,
    marginVertical: 0,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold" },
  timeFrameContainer: { flexDirection: "row", borderRadius: 10, padding: 2 },
  timeBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  timeText: { fontSize: 10, fontWeight: "700" },
  pagingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dateRangeText: { fontSize: 12, fontWeight: "600" },
  arrowBtn: {
    padding: 6,
    backgroundColor: "rgba(25, 17, 9, 0.53)",
    borderRadius: 100,
  },
  chartWrapper: { alignItems: "center", marginLeft: -20 },
  xAxisText: { fontSize: 9, fontWeight: "600" },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 15,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11 },
  tooltipContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 110,
  },
  tooltipLabel: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  tooltipValue: { fontSize: 11, fontWeight: "700" },
});

export default GeneralAnalyticsChart;
