import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { ThemedView, ThemedText } from "@/components/shared";
import { Product } from "@/types/stock";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ProductOptionsModal } from "@/components/products";
import { ProductAction } from "@/components/products/ProductCard";
import { useStock } from "@/contexts/StockContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  product: Product;
  onMorePress?: () => void;
}

const ProductHero = ({ product, onMorePress }: Props) => {
  const iconColor = useThemeColor({}, "text");
  const { controller, refreshProducts } = useStock();

  const [optionsVisible, setOptionsVisible] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "empty" | "delete";
  }>({ visible: false, type: "delete" });

  const goToProduct = () => {
    router.push({
      pathname: "/products/[id]",
      params: { id: product.id.toString() },
    });
  };

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "pin":
        await controller.togglePin(product.id, product.is_pinned === 0);
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

  // Replace with your actual logic for product image fallback
  const imageSource = product.image
    ? { uri: product.image }
    : require("@/assets/images/placeholder.png");

  return (
    <ThemedView style={styles.container}>
      <ProductOptionsModal
        isVisible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        product={product}
        isPinned={product.is_pinned === 1}
        onAction={handleAction}
        isProductPage={true}
      />

      {/* 1. Main Thumbnail Image */}
      <Image source={imageSource} style={styles.thumbnail} resizeMode="cover" />

      {/* 2. Fixed Floating Back Icon */}
      <TouchableOpacity
        style={[styles.floatingBtn, styles.leftBtn]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={styles.blurWrapper} tint="dark">
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* 3. Fixed Floating More Option Icon */}
      <TouchableOpacity
        style={[styles.floatingBtn, styles.rightBtn]}
        onPress={() => setOptionsVisible(true)}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={styles.blurWrapper} tint="dark">
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* Optional: Bottom overlay for text readability */}
      <ThemedView style={styles.overlayInfo}>
        <ThemedText type="title" style={styles.productTitle}>
          {product.title}
        </ThemedText>
        <ThemedText style={styles.productSubtitle}>{product.weight}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default ProductHero;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 320,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  floatingBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 50,
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
  },
  leftBtn: {
    left: 20,
  },
  rightBtn: {
    right: 20,
  },
  overlayInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#00000063",
  },
  productTitle: {
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  productSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: 600,
    marginTop: 4,
  },
});
