// Leqa © 2025 Mithula Chanthuka
import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { ProductCard } from "@/components/products";
import { NoProductsFound, ThemedText } from "@/components/shared";

const ProductsContent = () => {
  const { products } = useStock();

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NoProductsFound />
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={styles.itemWrapper}>
          <ProductCard item={item} />
        </View>
      )}
      ListEmptyComponent={renderEmpty}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 0, 
    paddingBottom: 120,
    flexGrow: 1, 
  },
  row: {
    justifyContent: "flex-start", 
  },
  itemWrapper: {
    flex: 0.5,
    padding: 0
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});

export default ProductsContent;