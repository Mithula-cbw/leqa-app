// Leqa © 2025 Mithula Chanthuka

import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import BottomSheet from "@/components/ui/BottomSheet";
import {
  AlertDialog,
  ReductionModal,
  ThemedText,
  ThemedView,
} from "@/components/shared";
import { useStock } from "@/contexts/StockContext";

import {
  InventorySection,
  ProductRestockSheet,
  ProductSellSheet,
} from "@/features/products";

import { Product } from "@/types/stock";
import { CURRENCY_SYMBOL } from "@/utils/currency";
import { useThemeColor } from "@/hooks/use-theme-color";

import { ProductOptionsModal } from "@/components/products";
import { ProductAction } from "@/components/products/ProductCard";
import { ReduceMode } from "@/components/home/ProductCard";
import { ReductionReason } from "@/types/customer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, controller, refreshProducts } = useStock();

  const [stockSheetVisible, setStockSheetVisible] = useState(false);
  const [sellSheetVisible, setSellSheetVisible] = useState(false);

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const [reduceModal, setReduceModal] = useState(false);
  const [reduceMode, setReduceMode] = useState<ReduceMode>("one");

  const product = useMemo(
    () => products.find((p) => p.id === Number(id)),
    [products, id]
  );

  if (!product) {
    return (
      <View style={styles.center}>
        <ThemedText>Product not found</ThemedText>
      </View>
    );
  }

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "pin":
        await controller.togglePin(product.id, product.is_pinned === 0);
        await refreshProducts();
        return;

      case "empty":
        // open reduce modal (bulk reduce all)
        setReduceMode("all");
        setReduceModal(true);
        return;

      case "delete":
        setDeleteAlertVisible(true);
        return;
    }
  };

  const confirmDelete = async () => {
    setDeleteAlertVisible(false);
    await controller.deleteProduct(product.id);
    await refreshProducts();
    router.replace("/products");
  };

  const onReduceConfirm = async (type: ReductionReason) => {
    if (!product.total_stock || Number(product.total_stock) <= 0) return;

    const stockToReduce = Number(product.total_stock);

    if (reduceMode === "all") {
      await controller.reduceStockWithLogic(product.id, stockToReduce, type, {
        note: `Bulk ${type} of entire stock`,
      });
    } else {
      await controller.reduceStockWithLogic(product.id, 1, type, {
        price: product.price,
      });
    }

    await refreshProducts();
    setReduceModal(false);
  };

  const Header = (
    <>
      <ProductHeroDisplay
        product={product}
        onOpenOptions={() => setOptionsVisible(true)}
        onEdit={() => router.push(`/(tabs)/products/product/${product.id}/edit`)}
      />
      <View style={styles.divider} />
      <ProductInfoDisplay
        product={product}
        onSell={() => setSellSheetVisible(true)}
        onStock={() => setStockSheetVisible(true)}
        onEdit={() => router.push(`/(tabs)/products/product/${product.id}/edit`)}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {/* ✅ More options modal */}
      <ProductOptionsModal
        isVisible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        product={product}
        isPinned={product.is_pinned === 1}
        onAction={handleAction}
        isProductPage={true}
      />

      {/* ✅ Empty stock modal */}
      <ReductionModal
        reduceMode={reduceMode}
        isVisible={reduceModal}
        product={product}
        onClose={() => setReduceModal(false)}
        onConfirm={onReduceConfirm}
      />

      {/* ✅ Delete confirm */}
      <AlertDialog
        isVisible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${product.title}? This cannot be undone.`}
        confirmText="Delete"
        isDestructive
      />

      <InventorySection productId={product.id} ListHeaderComponent={Header} />

      <BottomSheet
        sheetTitle="Update Stock"
        visible={stockSheetVisible}
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
        sheetTitle="Sell Stock"
        visible={sellSheetVisible}
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

/** Read-only hero with Edit + More buttons */
function ProductHeroDisplay({
  product,
  onOpenOptions,
  onEdit,
}: {
  product: Product;
  onOpenOptions: () => void;
  onEdit: () => void;
}) {
  const imageSource = product.image
    ? { uri: product.image }
    : require("@/assets/images/placeholder.png");

  return (
    <ThemedView style={heroStyles.container}>
      <Image
        source={imageSource}
        style={heroStyles.thumbnail}
        resizeMode="cover"
      />

      {/* Back */}
      <TouchableOpacity
        style={[heroStyles.floatingBtn, heroStyles.leftBtn]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={heroStyles.blurWrapper} tint="dark">
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* More options (ellipsis) */}

      {/* Edit */}
      <TouchableOpacity
        style={[heroStyles.floatingBtn, heroStyles.rightBtn]}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={heroStyles.blurWrapper} tint="dark">
          <Ionicons name="create-outline" size={22} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      <TouchableOpacity
        style={[heroStyles.floatingBtn, heroStyles.moreBtn]}
        onPress={onOpenOptions}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={heroStyles.blurWrapper} tint="dark">
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* Bottom overlay */}
      <ThemedView style={heroStyles.overlayInfo}>
        <ThemedText style={heroStyles.title}>{product.title}</ThemedText>
        <ThemedText style={heroStyles.dot}>·</ThemedText>
        <ThemedText style={heroStyles.subTitle}>
          {product.weight_value} {product.weight_unit}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

/** Read-only info section */
function ProductInfoDisplay({
  product,
  onSell,
  onStock,
  onEdit,
}: {
  product: Product;
  onSell: () => void;
  onStock: () => void;
  onEdit: () => void;
}) {
  const accent = useThemeColor({}, "accent");

  return (
    <View style={infoStyles.container}>
      <View style={infoStyles.priceRow}>
        <ThemedText style={infoStyles.price}>
          {CURRENCY_SYMBOL} {product.price}.00
        </ThemedText>

        <TouchableOpacity
          onPress={onEdit}
          style={infoStyles.editBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <ThemedText style={infoStyles.editText}>Edit</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={infoStyles.section}>
        <ThemedText style={infoStyles.label}>Description</ThemedText>
        <ThemedText style={infoStyles.description}>
          {product.description || "No description provided."}
        </ThemedText>
      </View>

      <View style={infoStyles.actionRow}>
        <TouchableOpacity
          onPress={onSell}
          style={[infoStyles.primaryBtn, { backgroundColor: accent }]}
          activeOpacity={0.85}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <ThemedText style={infoStyles.primaryText}>Sell</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStock}
          style={infoStyles.secondaryBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#111" />
          <ThemedText style={infoStyles.secondaryText}>Restock</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

const heroStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 320,
    position: "relative",
  },
  thumbnail: { width: "100%", height: "100%" },
  floatingBtn: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    zIndex: 10,
  },
  blurWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  leftBtn: { top: Platform.OS === "ios" ? 70 : 50, left: 20 },
  rightBtn: { top: Platform.OS === "ios" ? 70 : 50, right: 70 },
  moreBtn: { top: Platform.OS === "ios" ? 70 : 50, right: 20 },

  overlayInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#00000063",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  dot: { color: "rgba(255,255,255,0.65)", fontSize: 18, fontWeight: "700" },
  subTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
});

const infoStyles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 18 },
  section: { gap: 6 },
  label: { fontSize: 13, fontWeight: "700", opacity: 0.5 },
  description: { fontSize: 15, lineHeight: 22, opacity: 0.85 },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 20, fontWeight: "800" },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  editText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  actionRow: { flexDirection: "row", gap: 12 },
  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryText: { color: "#fff", fontWeight: "700" },

  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#111",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  secondaryText: { fontWeight: "700" },
});
