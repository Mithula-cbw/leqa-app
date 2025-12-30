import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { InventorySection, ProductHero } from "@/features/products";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useStock();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <View style={styles.center}>
        <ThemedText>Product not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <ProductHero product={product} />

      <View style={styles.divider} />

      {/* BATCHES / HISTORY SECTION */}
      <View style={{ flex: 1 }}>
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold">Inventory Batches</ThemedText>
        </View>
        <InventorySection productId={product.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },

  // New Styles for Details
  productHero: {
    flexDirection: "row",
    padding: 16,
    gap: 20,
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  categoryText: {
    fontSize: 14,
    opacity: 0.5,
  },
  stockInfo: {
    marginTop: 4,
  },
  stockLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.5,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
