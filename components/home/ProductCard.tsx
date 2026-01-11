// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
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
import { ReductionReason } from "@/types/customer";
import { useTransactions } from "@/contexts/TransactionContext";

export type ReduceMode = "one" | "all";

const ProductCard = ({ item }: { item: Product }) => {
  const { loading, controller, refreshProducts } = useStock();
  const {refreshTransactions} = useTransactions();
  const [processing, setProcessing] = useState(false);

  const [reduceModal, setReduceModal] = useState(false);
  const [reduceMode, setReduceMode] = useState<ReduceMode>("one");
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const cardBg = useThemeColor({}, "sheet");
  const bgSecondary = useThemeColor({}, "background-seconary");
  const iconColor = useThemeColor({}, "icon");

  const goToProduct = () => {
    router.push({
      pathname: "/products/[id]",
      params: { id: item.id.toString() },
    });
  };

  const confirmDelete = async () => {
    await controller.deleteProduct(item.id);
    await refreshProducts();
    setDeleteAlertVisible(false);
  };

  const handleIncrease = async () => {
    console.log("do shelf_life_days", item.shelf_life_years); // dev-log
    console.log("do warn", item.do_warn); // dev-log

    // Check if expiration logic is active for this specific product
    const isExpireActive = item.do_expire === 1;
    const isWarnActive = item.do_warn === 1;

    let expiry: Date | null = null;
    let warnDate: Date | null = null;

    if (isExpireActive) {
      // Extract durations (using fallbacks for safety)
      const shelfY = item.shelf_life_years ?? 0;
      const shelfM = item.shelf_life_months ?? 0;
      const shelfD = item.shelf_life_days ?? 7;
      const shelfH = item.shelf_life_hours ?? 0;

      // Calculate Expiry Date
      expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + shelfY);
      expiry.setMonth(expiry.getMonth() + shelfM);
      expiry.setDate(expiry.getDate() + shelfD);
      expiry.setHours(expiry.getHours() + shelfH);

      // Calculate Warning Date if enabled
      if (isWarnActive) {
        const warnM = item.warning_period_months ?? 0;
        const warnD = item.warning_period_days ?? 1;
        const warnH = item.warning_period_hours ?? 0;

        warnDate = new Date(expiry);
        warnDate.setMonth(warnDate.getMonth() - warnM);
        warnDate.setDate(warnDate.getDate() - warnD);
        warnDate.setHours(warnDate.getHours() - warnH);
      }
    }

    // Save the new batch (adding exactly 1 to stock)
    try {
      await controller.addStockBatch(item.id, 1, expiry, warnDate);
      await refreshProducts();
    } catch (error) {
      console.error("Failed to increase stock:", error);
    }
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
        if (!item.total_stock || item.total_stock <= 0) return;
        setReduceMode("all");
        setReduceModal(true);
        return;

      case "delete":
        setDeleteAlertVisible(true);
        return;
    }

    await refreshProducts();
  };

  const onReduceConfirm = async (type: ReductionReason) => {
    if (processing) return;
    if (!item.total_stock || Number(item.total_stock) <= 0) return;

    setProcessing(true);

    try {
      const stockToReduce = Number(item.total_stock);

      if (reduceMode === "all") {
        await controller.reduceStockWithLogic(item.id, stockToReduce, type, {
          price: item.price, // ✅ UNIT PRICE ONLY
          customerId: 1,
          note: `Bulk ${type} of entire stock`,
        });
      } else {
        await controller.reduceStockWithLogic(item.id, 1, type, {
          price: item.price, // ✅ UNIT PRICE ONLY
          customerId: 1,
        });
      }

      await refreshProducts();
      await refreshTransactions();
      setReduceModal(false);
    } catch (error) {
      console.error("Stock reduction failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <ProductSkeleton />;

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

              <ThemedText style={styles.subText}>{`${item.weight_value} ${
                item.weight_unit ?? "g"
              }`}</ThemedText>
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
              onPress={() => {
                setReduceMode("one");
                setReduceModal(true);
              }}
              disabled={item.total_stock <= 0 || processing}
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
              disabled={processing}
              style={[styles.btn, styles.addBtn]}
            >
              <ThemedText style={styles.btnText}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
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
