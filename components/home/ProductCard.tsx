// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ReductionModal, ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/stock";
import { useStock } from "@/contexts/StockContext";
import { formatText } from "@/utils/formatText";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProductSkeleton from "./ProductSkeleton";

const ProductCard = ({ item }: { item: Product }) => {
  const goToProduct = () => {
    router.push(`/products`);
    console.log("prodcut", item.id); // dev-log
  };
  const { loading, controller, refreshProducts } = useStock();
  const [modalVisible, setModalVisible] = useState(false);

  const cardBg = useThemeColor({}, "sheet");
  const bgSecondary = useThemeColor({}, "background-seconary");
  const chevronClr = useThemeColor({}, "icon");

  const handleIncrease = async () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + (item.default_shelf_life ?? 7));
    await controller.addStockBatch(item.id, 1, expiry.toISOString());
    await refreshProducts();
  };

  const onReduceConfirm = async (type: "sell" | "waste" | "delete") => {
    console.log(`Action: ${type.toUpperCase()} - Product: ${item.title}`);

    if (item.total_stock > 0) {
      await controller.reduceStock(item.id, 1);
      await refreshProducts();
    }
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View>
        <ProductSkeleton />
      </View>
    );
  }

  return (
    <>
      <ReductionModal
        isVisible={modalVisible}
        productTitle={item.title}
        onClose={() => setModalVisible(false)}
        onConfirm={onReduceConfirm}
      />

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        {/* left side */}
        <View style={styles.leftSection}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
          ) : (
            <View
              style={[styles.placeholder, { backgroundColor: bgSecondary }]}
            >
              <ThemedText style={styles.placeholderText}>
                {item.title[0].toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>

        {/* right side */}
        <View style={styles.rightSection}>
          <View style={styles.rightInner}>
            <View style={styles.info}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {formatText(item.title, "title")}
              </ThemedText>
              <View style={styles.detailsRow}>
                <ThemedText style={styles.subText}>{item.weight}</ThemedText>
              </View>
            </View>
            <TouchableOpacity
              onPress={goToProduct}
              style={styles.caretBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-forward" size={22} color={chevronClr} />
            </TouchableOpacity>
          </View>

          <View style={[styles.controls, { backgroundColor: bgSecondary }]}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              disabled={item.total_stock <= 0}
              style={[
                styles.btn,
                styles.reduceBtn,
                item.total_stock <= 0 && { opacity: 0.3 },
              ]}
            >
              <ThemedText style={styles.btnText}>-</ThemedText>
            </TouchableOpacity>

            <View style={styles.stockCount}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color: item.total_stock === 0 ? "#000000ff" : undefined,
                }}
              >
                {item.total_stock}
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={handleIncrease}
              style={[styles.btn, styles.addBtn]}
            >
              <ThemedText style={styles.btnText}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    height: 120,
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
    shadowOpacity: 0.05,
  },
  leftSection: { flexDirection: "column", alignItems: "flex-start" },
  thumbnail: { width: 100, height: 100, borderRadius: 12, marginRight: 12 },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { opacity: 0.4, fontSize: 18, fontWeight: "bold" },
  info: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 2
  },
  detailsRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  subText: { fontSize: 16, opacity: 0.9, color: "#19a139ff" },
  dot: { marginHorizontal: 4, opacity: 0.3 },
  rightSection: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    borderRadius: 12,
    alignItems: "flex-start",
  },
  rightInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controls: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 18,
    padding: 3,
  },
  stockCount: { paddingHorizontal: 8, minWidth: 28, alignItems: "center" },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  addBtn: { backgroundColor: "#e7f3ef" },
  reduceBtn: { backgroundColor: "#fff3cd" },
  btnText: { fontSize: 18, fontWeight: "600" },
  caretBtn: {
    marginTop: 6,
    padding: 4,
  },
});
