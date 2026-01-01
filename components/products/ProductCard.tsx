// components/products/ProductCard.tsx
// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AlertDialog, ReductionModal, ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/stock";
import { formatText } from "@/utils/formatText";
import { useStock } from "@/contexts/StockContext";
import ProductOptionsModal from "./ProductOptionsModal";
import ProductCardSkeleton from "./ProductSkeleton";
import { ReduceMode } from "../home/ProductCard";
import { ReductionReason } from "@/types/customer";

export type ProductAction = "view" | "edit" | "pin" | "empty" | "delete";

const ProductCard = ({ item }: { item: Product }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [reduceModal, setReduceModal] = useState(false);
  const [reduceMode, setReduceMode] = useState<ReduceMode>("one");
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const { loading, controller, refreshProducts } = useStock();

  const cardBg = useThemeColor({}, "sheet");
  const shadow = useThemeColor({}, "text");
  const bgSecondary = useThemeColor({}, "background-seconary");

  const confirmDelete = async () => {
    await controller.deleteProduct(item.id);
    await refreshProducts();
    setDeleteAlertVisible(false);
  };

  const goToProduct = () => {
    router.push({
      pathname: "/products/[id]",
      params: { id: item.id.toString() },
    });
  };

  const onReduceConfirm = async (type: ReductionReason) => {
    if (!item.total_stock || Number(item.total_stock) <= 0) return;

    const stockToReduce = Number(item.total_stock);

    if (reduceMode === "all") {
      await controller.reduceStockWithLogic(item.id, stockToReduce, type, {
        note: `Bulk ${type} of entire stock`,
      });
    } else {
      await controller.reduceStockWithLogic(item.id, 1, type, {
        price: item.price,
      });
    }

    await refreshProducts();
  };

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "view":
        goToProduct();
        break;

      case "edit":
        goToProduct();
        break;

      case "pin":
        await controller.togglePin(item.id, item.is_pinned === 0);
        break;

      case "empty":
        setReduceMode("all");
        setReduceModal(true);
        return;

      case "delete":
        setDeleteAlertVisible(true);
        return;
    }

    await refreshProducts();
  };

  if (loading) return <ProductCardSkeleton />;

  return (
    <>
      {/* Reduce modal */}
      <ReductionModal
        reduceMode={reduceMode}
        isVisible={reduceModal}
        product={item}
        onClose={() => setReduceModal(false)}
        onConfirm={onReduceConfirm}
      />
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
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 4,
            }}
          >
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
          <ThemedText style={styles.subText}>{`${item.weight_value} ${
            item.weight_unit ?? "g"
          }`}</ThemedText>
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

      <AlertDialog
        isVisible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${item.title}? This cannot be undone.`}
        confirmText="Delete"
        isDestructive
      />
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    margin: 5,
    overflow: "hidden",
    elevation: 5,
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
