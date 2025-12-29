// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/shared";
import {
  AddStockSheet,
  FloatingActionButtons,
  HomeHeader,
  HomeHero,
  ProductSection,
} from "@/features/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useStock } from "@/contexts/StockContext";
import BottomSheet from "@/components/ui/BottomSheet";
// import InventoryTestScreen from "@/features/test/InventoryTestScreen";

export default function Index() {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const { products, loading } = useStock();
  const [sheetVisible, setSheetVisible] = useState(false);

  const onAdd = () => {
    setSheetVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHero />

        <View style={[styles.content, { backgroundColor: bgSecondary }]}>
          <ProductSection products={products} isLoading={loading} />
          {/* <InventoryTestScreen /> */}
        </View>
      </ScrollView>

      <FloatingActionButtons
        onAdd={onAdd}
        onRemove={() => console.log("Remove/Reduce Stock")}
      />
      <BottomSheet
        sheetTitle="Update Stock"
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        animationDuration={400}
      >
        {/* <View style={styles.test}></View> */}
        <AddStockSheet onFinish={() => setSheetVisible(false)} />
      </BottomSheet>
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
  test: {
    backgroundColor: "blue",
    height: 800,
  },
});
