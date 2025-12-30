// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { AlertDialog, ReductionModal, ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/stock";
import { useStock } from "@/contexts/StockContext";
import { formatText } from "@/utils/formatText";
import { router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ProductSkeleton from "./ProductSkeleton";
import { ProductAction } from "../products/ProductCard";
import ProductOptionsModal from "../products/ProductOptionsModal";

const ProductCard = ({ item }: { item: Product }) => {
  const { loading, controller, refreshProducts } = useStock();

  const [reduceModal, setReduceModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "empty" | "delete";
  }>({ visible: false, type: "delete" });
  const [optionsVisible, setOptionsVisible] = useState(false);

  const cardBg = useThemeColor({}, "sheet");
  const bgSecondary = useThemeColor({}, "background-seconary");
  const iconColor = useThemeColor({}, "icon");

  const handleConfirmedAction = async () => {
    if (alertConfig.type === "delete") {
      await controller.deleteProduct(item.id);
    } else {
      await controller.reduceStock(item.id, item.total_stock);
    }
    await refreshProducts();
  };

  const goToProduct = () => {
    router.push({ pathname: "/products", params: { id: item.id } });
  };

  const handleIncrease = async () => {
    const expiry = new Date();
    const value = item.shelf_life_value ?? 1;
    const unit = item.shelf_life_unit ?? "days";

    if (unit === "years") expiry.setFullYear(expiry.getFullYear() + value);
    else if (unit === "hours") expiry.setHours(expiry.getHours() + value);
    else expiry.setDate(expiry.getDate() + value);

    await controller.addStockBatch(item.id, 1, expiry.toISOString());
    await refreshProducts();
  };

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "view":
        goToProduct();
        break;

      case "edit":
        router.push({ pathname: "/products", params: { id: item.id } });
        break;

      case "pin":
        await controller.togglePin(item.id, item.is_pinned === 0);
        break;

      case "empty":
        setAlertConfig({ visible: true, type: "empty" });
        return;

      case "delete":
        setAlertConfig({ visible: true, type: "delete" });
        return;
    }

    await refreshProducts();
  };

  const onReduceConfirm = async () => {
    if (item.total_stock > 0) {
      await controller.reduceStock(item.id, 1);
      await refreshProducts();
    }
    setReduceModal(false);
  };

  if (loading) return <ProductSkeleton />;

  return (
    <>
      {/* Reduce modal */}
      <ReductionModal
        isVisible={reduceModal}
        product={item}
        onClose={() => setReduceModal(false)}
        onConfirm={onReduceConfirm}
      />

      {/* Options modal */}
      <ProductOptionsModal
        isVisible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        product={item}
        isPinned={item.is_pinned === 1}
        onAction={handleAction}
      />

      <Pressable
        onPress={goToProduct}
        style={[styles.card, { backgroundColor: cardBg }]}
      >
        {/* LEFT */}
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

        {/* RIGHT */}
        <View style={styles.rightSection}>
          <View style={styles.rightInner}>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <ThemedText numberOfLines={1} type="defaultSemiBold">
                  {formatText(item.title, "title")}
                </ThemedText>

                {item.is_pinned === 1 && (
                  <View style={styles.pinBadge}>
                    <AntDesign name="pushpin" size={12} color={iconColor} />
                  </View>
                )}
              </View>

              <ThemedText style={styles.subText}>{item.weight}</ThemedText>
            </View>

            {/* OPTIONS */}
            <TouchableOpacity
              onPress={() => setOptionsVisible(true)}
              hitSlop={10}
              style={styles.optionsBtn}
            >
              <Ionicons name="ellipsis-vertical" size={18} color={iconColor} />
            </TouchableOpacity>
          </View>

          {/* CONTROLS */}
          <View style={[styles.controls, { backgroundColor: bgSecondary }]}>
            <TouchableOpacity
              onPress={() => setReduceModal(true)}
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
              <ThemedText type="defaultSemiBold">{item.total_stock}</ThemedText>
            </View>

            <TouchableOpacity
              onPress={handleIncrease}
              style={[styles.btn, styles.addBtn]}
            >
              <ThemedText style={styles.btnText}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
      <AlertDialog
        isVisible={alertConfig.visible}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onConfirm={handleConfirmedAction}
        title={alertConfig.type === "delete" ? "Delete Product" : "Empty Stock"}
        description={
          alertConfig.type === "delete"
            ? `Are you sure you want to delete ${item.title}? This cannot be undone.`
            : `This will remove all current stock batches for ${item.title}.`
        }
        confirmText={alertConfig.type === "delete" ? "Delete" : "Empty Now"}
        isDestructive={alertConfig.type === "delete"}
      />
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    height: 100,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.05,
  },
  leftSection: { flexDirection: "column", alignItems: "flex-start" },
  thumbnail: { width: 90, height: 90, borderRadius: 12, marginRight: 6 },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  pinBadge: {
    padding: 4,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },

  optionsBtn: {
    paddingVertical: 2,
    marginTop: 3,
  },

  placeholderText: { opacity: 0.4, fontSize: 18, fontWeight: "bold" },
  info: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 2,
    marginTop: 2,
  },
  detailsRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  subText: { fontSize: 16, opacity: 0.9, color: "#19a139ff" },
  dot: { marginHorizontal: 4, opacity: 0.3 },
  rightSection: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    borderRadius: 12,
    alignItems: "flex-end",
    marginRight: 3,
  },
  rightInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controls: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 3,
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
