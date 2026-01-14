// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import {
  InventorySection,
  ProductHero,
  ProductInfoSection,
  ProductRestockSheet,
  ProductSellSheet,
} from "@/features/products";
import BottomSheet from "@/components/ui/BottomSheet";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useStock();

  const [StocksheetVisible, setStockSheetVisible] = useState(false);
  const [SellsheetVisible, setSellSheetVisible] = useState(false);

  const onStock = () => setStockSheetVisible(true);
  const onSell = () => setSellSheetVisible(true);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <View style={styles.center}>
        <ThemedText>Product not found</ThemedText>
      </View>
    );
  }

  const Header = (
    <>
      <ProductHero product={product} />
      <View style={styles.divider} />
      {/* Ensure onStock is linked to the 'Restock' button inside ProductInfoSection */}
      <ProductInfoSection onStock={onStock} onSell={onSell} product={product} />
    </>
  );

  return (
    <View style={styles.container}>
      <InventorySection productId={product.id} ListHeaderComponent={Header} />

      {/* BottomSheet usually needs a specific height or flex property */}
      <BottomSheet
        sheetTitle={`Update Stock`}
        visible={StocksheetVisible}
        onClose={() => setStockSheetVisible(false)}
        animationDuration={600}
      >
        <View style={{ height: 350 }}>
          <ProductRestockSheet
            product={product}
            onFinish={() => setStockSheetVisible(false)}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        sheetTitle={`Sell Stock`}
        visible={SellsheetVisible}
        onClose={() => setSellSheetVisible(false)}
        animationDuration={600}
      >
        <View style={{ height: 450 }}>
          <ProductSellSheet
            product={product}
            onFinish={() => setSellSheetVisible(false)}
          />
        </View>
      </BottomSheet>
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
