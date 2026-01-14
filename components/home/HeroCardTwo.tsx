// Leqa © 2025 Mithula Chanthuka

import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Pressable,
} from "react-native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Transaction } from "@/types/customer";
import { CURRENCY_SYMBOL } from "@/utils/currency";

interface HeroProfitCardProps {
  transactions: Transaction[];
}

const HeroProfitCard = ({ transactions }: HeroProfitCardProps) => {
  const router = useRouter();
  const accent = useThemeColor({}, "accent");

  const profitThisMonth = useMemo(() => {
    const start = dayjs().startOf("month");
    const end = dayjs().endOf("month");

    const monthTx = transactions.filter((t) =>
      dayjs(t.created_at).isBetween(start, end, null, "[]")
    );

    const revenue = monthTx
      .filter((t) => t.type === "sale" || t.type === "other_income")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const expenses = monthTx
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    return revenue - expenses;
  }, [transactions]);

  const isNegative = profitThisMonth < 0;
  const displayProfit = `${isNegative ? "-" : ""}${CURRENCY_SYMBOL} ${Math.abs(
    profitThisMonth
  ).toLocaleString()}`;

  return (
    <Pressable
      onPress={() => router.push("/analytics")}
      style={styles.container}
      android_ripple={{ color: "#00000022" }}
    >
      <ImageBackground
        source={require("../../assets/images/hero.jpg")}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.title}>Profit This Month</ThemedText>
              <ThemedText style={styles.subTitle}>
                {dayjs().format("MMMM YYYY")}
              </ThemedText>
            </View>

            <View style={styles.right}>
              <ThemedText style={styles.amountText}>{displayProfit}</ThemedText>

              <View style={styles.ctaRow}>
                <ThemedText style={[styles.ctaText, { color: accent }]}>
                  View analytics
                </ThemedText>
                <Ionicons name="chevron-forward" size={16} color={accent} />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default HeroProfitCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    borderRadius: 24,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    borderRadius: 24,
    paddingBottom: 14,
    paddingHorizontal: 15,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 24,
    paddingLeft: 2,
  },
  subTitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    paddingLeft: 2,
  },
  right: { alignItems: "flex-end" },
  amountText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 24,
  },
  ctaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ctaText: { fontSize: 11, fontWeight: "800" },
});
