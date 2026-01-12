// Leqa © 2025 Mithula Chanthuka

import React, { useState, useMemo } from "react";
import { FlatList, View, StyleSheet, TextInput } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { ProductCard, ProductSkeleton } from "@/components/products";
import { NoProductsFound } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

const ProductsContent = () => {
  const { products, loading } = useStock();
  const [searchQuery, setSearchQuery] = useState("");

  const bgSecondary = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const iconMuted = useThemeColor({}, "icon");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(query);
      const descriptionMatch = p.description?.toLowerCase().includes(query);
      return titleMatch || descriptionMatch;
    });
  }, [searchQuery, products]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NoProductsFound />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar Container */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: bgSecondary }]}>
          <Ionicons
            name="search"
            size={18}
            color={iconMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={iconMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: textColor }]}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={iconMuted}
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5].map((key) => (
            <ProductSkeleton key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
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
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 5,
    paddingBottom: 320,
    flexGrow: 1,
  },
  row: {
    justifyContent: "flex-start",
  },
  itemWrapper: {
    flex: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
});

export default ProductsContent;
