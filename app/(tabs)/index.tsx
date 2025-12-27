// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View, FlatList } from "react-native";
import React from "react";
import { ThemedView } from "@/components/shared";
import { FloatingActionButtons, HomeHeader, HomeHero } from "@/features/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useStock } from "@/contexts/StockContext";

export default function Index() {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const { products, loading } = useStock();

  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <HomeHero />

      {/* content */}
      <View style={[styles.content, { backgroundColor: bgSecondary }]}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              
            </View>
          )}
        />
      </View>

      <FloatingActionButtons
        onAdd={() => console.log("Add Product")}
        onRemove={() => console.log("Remove/Reduce Stock")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    marginTop: 35,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    overflow: "hidden",
  },
  listPadding: {
    padding: 20,
    paddingBottom: 100,
  },
  productCard: {
    
  },
});
