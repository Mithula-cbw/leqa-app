// Leqa © 2025 Mithula Chanthuka

import React, { useMemo } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Product } from "@/types/stock";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ProductCard, ProductSkeleton } from "@/components/home";
import { NoProductsFound } from "@/components/shared";

const ProductSection: React.FC<{ products: Product[]; isLoading: boolean }> = ({
  products,
  isLoading,
}) => {
  const subColor = useThemeColor({}, "text-subtitle");

  const displayData = useMemo(() => {
    const pinned = products.filter((p) => p.is_pinned === 1);

    if (pinned.length === 0) {
      return products.slice(0, 2);
    }

    if (pinned.length === 1) {
      const otherProducts = products
        .filter((p) => p.id !== pinned[0].id)
        .slice(0, 1);
      return [...pinned, ...otherProducts];
    }

    return pinned;
  }, [products]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: subColor }]}>
          {products.some((p) => p.is_pinned) ? "Pinned Products" : "Quick View"}
        </Text>

        <ProductSkeleton />
        <ProductSkeleton />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return <NoProductsFound />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: subColor }]}>
        {products.some((p) => p.is_pinned) ? "Pinned Products" : "Quick View"}
      </Text>

      <FlatList
        data={displayData}
        keyExtractor={(item) => `product-${item.id}`}
        renderItem={({ item }) => <ProductCard item={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default ProductSection;

const styles = StyleSheet.create({
  container: { width: "100%" },
  sectionTitle: {
    marginLeft: 10,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "500",
  },
});
