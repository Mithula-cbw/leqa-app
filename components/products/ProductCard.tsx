// components/products/ProductCard.tsx
// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/stock";
import { formatText } from "@/utils/formatText";
import { useStock } from "@/contexts/StockContext";
import ProductOptionsModal from "./ProductOptionsModal";

export type ProductAction = "view" | "edit" | "pin" | "empty" | "delete";

const ProductCard = ({ item }: { item: Product }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { controller, refreshProducts } = useStock();

  const cardBg = useThemeColor({}, "sheet");
  const shadow = useThemeColor({}, "text");
  const bgSecondary = useThemeColor({}, "background-seconary");

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "view":
        router.push({ pathname: "/products", params: { id: item.id } });
        return;

      case "edit":
        router.push({ pathname: "/products", params: { id: item.id } });
        return;

      case "pin":
        await controller.togglePin(item.id, item.is_pinned === 0);
        break;

      case "empty":
        Alert.alert(
          "Empty Stock",
          `Clear all ${item.total_stock} items from ${item.title}?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Empty",
              style: "destructive",
              onPress: async () => {
                await controller.reduceStock(item.id, item.total_stock);
                await refreshProducts();
              },
            },
          ]
        );
        return;

      case "delete":
        Alert.alert("Delete Product", "This action cannot be undone.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await controller.deleteProduct(item.id);
              await refreshProducts();
            },
          },
        ]);
        return;
    }

    // Only refresh for non-confirmed, non-navigation actions
    await refreshProducts();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleAction("view")}
        style={[styles.card, { shadowColor: shadow, backgroundColor: cardBg }]}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: bgSecondary },
              ]}
            >
              <ThemedText style={styles.placeholderText}>
                {item.title[0].toUpperCase()}
              </ThemedText>
            </View>
          )}

          <TouchableOpacity
            style={styles.moreButton}
            onPress={(e) => {
              e.stopPropagation();
              setMenuVisible(true);
            }}
            hitSlop={12}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={{flex:1, flexDirection: "row", justifyContent: "flex-start", gap: 4}}>
              <ThemedText
                numberOfLines={1}
                type="defaultSemiBold"
                style={styles.title}
              >
                {formatText(item.title, "title")}
              </ThemedText>
              {item.is_pinned === 1 && (
                <View style={styles.pinBadge}>
                  <AntDesign name="pushpin" size={12} color={shadow} />
                </View>
              )}
          </View>
          <ThemedText style={styles.subText}>{item.weight}</ThemedText>
          <View style={styles.stockRow}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.stockCount,
                item.total_stock === 0 && { color: "#ff4444" },
              ]}
            >
              {item.total_stock}
            </ThemedText>
            <ThemedText style={styles.stockLabel}>in stock</ThemedText>
          </View>
        </View>
      </TouchableOpacity>

      <ProductOptionsModal
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        product={item}
        isPinned={item.is_pinned === 1}
        onAction={handleAction}
      />
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    margin: 6,
    overflow: "hidden",
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imageContainer: { width: "100%", height: 125, position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 28, fontWeight: "800", opacity: 0.3 },
  moreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 10,
  },
  pinBadge: {
    padding: 4,
    borderRadius: 8,
  },
  content: { padding: 10 },
  title: { fontSize: 14 },
  subText: { fontSize: 11, opacity: 0.6, marginTop: 2 },
  stockRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 6,
  },
  stockCount: { fontSize: 15, color: "#487d55" },
  stockLabel: {
    fontSize: 10,
    opacity: 0.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
});
