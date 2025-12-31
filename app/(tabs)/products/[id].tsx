import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import {
  InventorySection,
  ProductHero,
  ProductInfoSection,
} from "@/features/products";

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
      {/* FIXED HERO */}
      <ProductHero product={product} />

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.divider} />

        <ProductInfoSection product={product} />
        <InventorySection productId={product.id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
