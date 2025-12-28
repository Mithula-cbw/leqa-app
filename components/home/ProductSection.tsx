// Leqa © 2025 Mithula Chanthuka

import React, { useMemo } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

import { NoProductsFound } from "@/components/shared";
import ProductCard from "./ProductCard";
import { Product } from "@/types/stock";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ProductSectionProps {
  products: Product[];
  isLoading: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ products, isLoading }) => {
  const activeProducts = useMemo(
    () => products.filter((p) => p.total_stock > 0).slice(0, 2),
    [products]
  );
  const subColor = useThemeColor({}, "text-subtitle");

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: subColor }]}>In Stock</Text>

      {(activeProducts.length === 0 && !isLoading) ? (
        <NoProductsFound onAddProduct={() => router.push("/settings")} />
      ) : (
        <FlatList
          data={activeProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard item={item} />}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ProductSection;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 0,
  },
  sectionTitle: {
    marginLeft: 10,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "500",
  },
  list: {
    gap: 2,
  },
  emptyText: {
    opacity: 0.6,
    fontSize: 14,
  },
});
