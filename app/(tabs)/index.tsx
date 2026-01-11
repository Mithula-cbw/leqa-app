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
  RemoveStockSheet,
} from "@/features/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useStock } from "@/contexts/StockContext";
import BottomSheet from "@/components/ui/BottomSheet";

export default function Index() {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const { products, loading } = useStock();
  const [addVisible, setAddVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);

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
        onAdd={() => setAddVisible(true)}
        onRemove={() => setRemoveVisible(true)}
      />
      <BottomSheet
        sheetTitle="Update Stock"
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        animationDuration={400}
      >
        <AddStockSheet onFinish={() => setAddVisible(false)} />
      </BottomSheet>

      <BottomSheet
        sheetTitle="Process Sale"
        visible={removeVisible}
        onClose={() => setRemoveVisible(false)}
        animationDuration={400}
      >
        <RemoveStockSheet onFinish={() => setRemoveVisible(false)} />
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    marginTop: 25,
    paddingBottom: 393,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
