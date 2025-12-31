// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext"; // Ensure this path is correct

const HeroCardOne = () => {
  const { products } = useStock();

  // Calculate the total packets across all products
  const totalPackets = products.reduce(
    (sum, item) => sum + (item.total_stock || 0),
    0
  );

  // Count how many unique products have at least 1 packet in stock
  const activeProductsCount = products.filter(
    (item) => item.total_stock > 0
  ).length;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/hero.jpg")}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.overlay}>
          <View style={styles.Content}>
            <View style={styles.ContentInner}>
              <ThemedText style={styles.title}>Units Left</ThemedText>
              <ThemedText style={styles.subtitle}>
                belong to {activeProductsCount}{" "}
                {activeProductsCount === 1 ? "product" : "products"}
              </ThemedText>
            </View>
            <ThemedText style={styles.amountText}>{totalPackets}</ThemedText>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroCardOne;

// ... styles remain the same as you provided

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 20,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  Content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  ContentInner: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
    paddingLeft: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#ffffff",
    lineHeight: 14,
    letterSpacing: 1,
    paddingLeft: 2,
  },
  amountText: {
    fontSize: 60,
    fontWeight: "400",
    color: "#fff",
    lineHeight: 56,
  },
});
