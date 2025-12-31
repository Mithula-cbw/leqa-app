import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import {
  ThemedView,
  AlertDialog,
  ReductionModal,
  EditableField,
} from "@/components/shared";
import { Product } from "@/types/stock";
import { EditableWeight, ProductOptionsModal } from "@/components/products";
import { ProductAction } from "@/components/products/ProductCard";
import { useStock } from "@/contexts/StockContext";
import { ReduceMode } from "@/components/home/ProductCard";
import { push } from "expo-router/build/global-state/routing";
import { formatText } from "@/utils/formatText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  product: Product;
}

const ProductHero = ({ product }: Props) => {
  const { controller, refreshProducts } = useStock();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [reduceModal, setReduceModal] = useState(false);
  const [reduceMode, setReduceMode] = useState<ReduceMode>("one");

  const handleUpdate = async (field: string, value: any) => {
    try {
      await controller.updateProductField(product.id, field, value);
      await refreshProducts();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const confirmDelete = async () => {
    setDeleteAlertVisible(false);

    await controller.deleteProduct(product.id);
    await refreshProducts();

    router.replace("/products");
  };

  const onReduceConfirm = async () => {
    if (product.total_stock <= 0) return;

    if (reduceMode === "all") {
      await controller.reduceStock(product.id, product.total_stock);
    } else {
      await controller.reduceStock(product.id, 1);
    }

    await refreshProducts();
    setReduceModal(false);
  };

  const handleAction = async (action: ProductAction) => {
    switch (action) {
      case "pin":
        await controller.togglePin(product.id, product.is_pinned === 0);
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleUpdate("image", result.assets[0].uri);
    }
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

      <ReductionModal
        reduceMode={reduceMode}
        isVisible={reduceModal}
        product={product}
        onClose={() => setReduceModal(false)}
        onConfirm={onReduceConfirm}
      />

      <Image source={imageSource} style={styles.thumbnail} resizeMode="cover" />

      {/* Fixed Floating Back Icon */}
      <TouchableOpacity
        style={[styles.floatingBtn, styles.leftBtn]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={styles.blurWrapper} tint="dark">
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* Edit Image Button */}
      <TouchableOpacity
        style={[styles.floatingBtn, styles.imageBtn]}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={styles.blurWrapper} tint="dark">
          <MaterialCommunityIcons name="image-edit" size={24} color="#ffffffe7" />
        </BlurView>
      </TouchableOpacity>

      {/* Fixed Floating More Option Icon */}
      <TouchableOpacity
        style={[styles.floatingBtn, styles.rightBtn]}
        onPress={() => setOptionsVisible(true)}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={styles.blurWrapper} tint="dark">
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* Bottom overlay for text readability */}
      <ThemedView style={styles.overlayInfo}>
        <EditableField
          value={product.title}
          iconStyle={styles.editIconTitle}
          textStyle={styles.productTitle}
          iconColor="#fff"
          iconSize={19}
          onSave={(val) => handleUpdate("title", val)}
        />
        <EditableWeight
          value={product.weight_value}
          unit={product.weight_unit}
          onSave={(newVal, newUnit) => {
            handleUpdate("weight_value", newVal);
            handleUpdate("weight_unit", newUnit);
          }}
        />
      </ThemedView>

      <AlertDialog
        isVisible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${product.title}? This cannot be undone.`}
        confirmText="Delete"
        isDestructive
      />
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
  editIconTitle: {
    marginLeft: 2,
    marginBottom: 3,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 4,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
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
  leftBtn: {
    top: Platform.OS === "ios" ? 70 : 50,
    left: 20,
  },
  imageBtn: {
    right: 70,
    top: Platform.OS === "ios" ? 70 : 50,
  },
  rightBtn: {
    top: Platform.OS === "ios" ? 70 : 50,
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
    fontSize: 18,
    fontWeight: 600,
  },
  productSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 18,
    fontWeight: 600,
    marginTop: 4,
  },
});
