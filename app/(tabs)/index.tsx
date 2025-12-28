// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import { ThemedView } from "@/components/shared";
import { FloatingActionButtons, HomeHeader, HomeHero } from "@/features/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useStock } from "@/contexts/StockContext";
import { ProductSection } from "@/components/home";
// import InventoryTestScreen from "@/features/test/InventoryTestScreen";

export default function Index() {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const { products, loading } = useStock();

  return (
    <ThemedView style={styles.container}>
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHero />

        <View style={[styles.content, { backgroundColor: bgSecondary }]}>
          <ProductSection products={products} isLoading={loading}/>
          {/* <InventoryTestScreen /> */}
        </View>
      </ScrollView>

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
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    marginTop: 35,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
