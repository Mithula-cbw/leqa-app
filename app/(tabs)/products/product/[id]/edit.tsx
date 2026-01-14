// Leqa © 2025 Mithula Chanthuka

import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Switch,
  Modal,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import {
  ThemedView,
  ThemedText,
  AlertDialog,
  ReductionModal,
  EditableField,
} from "@/components/shared";

import { useStock } from "@/contexts/StockContext";
import { Product } from "@/types/stock";
import { ReductionReason } from "@/types/customer";
import { ReduceMode } from "@/components/home/ProductCard";
import { EditableWeight, ProductOptionsModal } from "@/components/products";
import { ProductAction } from "@/components/products/ProductCard";

import TimeRangePicker, { TimePickerValue } from "@/components/ui/TimePicker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatDuration } from "@/utils/formatText";
import { CURRENCY_SYMBOL } from "@/utils/currency";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useStock();

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

  return (
    <View style={styles.container}>
      <ProductHeroEdit product={product} />
      <View style={styles.divider} />
      <ProductInfoSectionEditable product={product} />
    </View>
  );
}

/** EDIT HERO (your current ProductHero, slightly adjusted route) */
function ProductHeroEdit({ product }: { product: Product }) {
  const { controller, refreshProducts } = useStock();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [reduceModal, setReduceModal] = useState(false);
  const [reduceMode, setReduceMode] = useState<ReduceMode>("one");

  const handleUpdate = async (field: string, value: any) => {
    try {
      await controller.updateProductField(product.id, field, value);
      await refreshProducts();
    } catch {
      alert("Failed to update");
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

  const imageSource = product.image
    ? { uri: product.image }
    : require("@/assets/images/placeholder.png");

  return (
    <ThemedView style={heroStyles.container}>
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

      <Image source={imageSource} style={heroStyles.thumbnail} resizeMode="cover" />

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

      {/* Edit Image */}
      <TouchableOpacity
        style={[heroStyles.floatingBtn, heroStyles.imageBtn]}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={heroStyles.blurWrapper} tint="dark">
          <MaterialCommunityIcons name="image-edit" size={24} color="#ffffffe7" />
        </BlurView>
      </TouchableOpacity>

      {/* More */}
      <TouchableOpacity
        style={[heroStyles.floatingBtn, heroStyles.rightBtn]}
        onPress={() => setOptionsVisible(true)}
        activeOpacity={0.7}
      >
        <BlurView intensity={60} style={heroStyles.blurWrapper} tint="dark">
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </BlurView>
      </TouchableOpacity>

      {/* Editable overlay */}
      <ThemedView style={heroStyles.overlayInfo}>
        <EditableField
          value={product.title}
          iconStyle={heroStyles.editIconTitle}
          textStyle={heroStyles.productTitle}
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
}

/** EDIT INFO SECTION (your current ProductInfoSection, unchanged core behavior) */
function ProductInfoSectionEditable({ product }: { product: Product }) {
  const { controller, refreshProducts } = useStock();

  const bgSecondary = useThemeColor({}, "background-seconary");
  const bgPrimary = useThemeColor({}, "background-muted");
  const accent = useThemeColor({}, "accent");

  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<"shelf" | "warn" | null>(null);
  const [tempTime, setTempTime] = useState<TimePickerValue | null>(null);

  const calculateDates = (baseDate: Date, p: Product) => {
    const expiry = new Date(baseDate);
    expiry.setFullYear(expiry.getFullYear() + (p.shelf_life_years || 0));
    expiry.setMonth(expiry.getMonth() + (p.shelf_life_months || 0));
    expiry.setDate(expiry.getDate() + (p.shelf_life_days || 7));
    expiry.setHours(expiry.getHours() + (p.shelf_life_hours || 0));

    const warn = new Date(expiry);
    warn.setMonth(warn.getMonth() - (p.warning_period_months || 0));
    warn.setDate(warn.getDate() - (p.warning_period_days || 1));
    warn.setHours(warn.getHours() - (p.warning_period_hours || 0));

    return { expiry, warn };
  };

  const handleToggle = async (field: keyof Product, value: boolean) => {
    const numericValue = value ? 1 : 0;
    await controller.updateProductField(product.id, field, numericValue);

    if (field === "do_expire") {
      if (!value) {
        await controller.updateAllBatchesForProduct(product.id, {
          expiry_at: null,
          warn_at: null,
        });
      } else {
        const defaultSync = calculateDates(new Date(), product);
        await controller.updateAllBatchesForProduct(product.id, {
          expiry_at: defaultSync.expiry,
          warn_at: product.do_warn ? defaultSync.warn : null,
        });
      }
    }

    if (field === "do_warn" && product.do_expire) {
      if (!value) {
        await controller.updateAllBatchesForProduct(product.id, { warn_at: null });
      } else {
        const batches = await controller.getProductBatches(product.id);
        for (const batch of batches) {
          if (batch.expiry_at) {
            const expiry = new Date(batch.expiry_at);
            expiry.setMonth(expiry.getMonth() - (product.warning_period_months || 0));
            expiry.setDate(expiry.getDate() - (product.warning_period_days || 0));
            expiry.setHours(expiry.getHours() - (product.warning_period_hours || 0));
            await controller.updateAllBatchesForProduct(product.id, { warn_at: expiry });
          }
        }
      }
    }

    await refreshProducts();
  };

  const openPicker = (type: "shelf" | "warn") => {
    setActiveField(type);
    setTempTime({
      year: type === "shelf" ? product.shelf_life_years || 0 : 0,
      month: type === "shelf" ? product.shelf_life_months || 0 : product.warning_period_months || 0,
      day: type === "shelf" ? product.shelf_life_days || 0 : product.warning_period_days || 0,
      hour: type === "shelf" ? product.shelf_life_hours || 0 : product.warning_period_hours || 0,
    });
    setModalVisible(true);
  };

  const handleSaveTime = async () => {
    if (!activeField || !tempTime) return;

    const updates =
      activeField === "shelf"
        ? {
            shelf_life_years: tempTime.year,
            shelf_life_months: tempTime.month,
            shelf_life_days: tempTime.day,
            shelf_life_hours: tempTime.hour,
          }
        : {
            warning_period_months: tempTime.month,
            warning_period_days: tempTime.day,
            warning_period_hours: tempTime.hour,
          };

    await controller.updateProductFields(product.id, updates);

    if (product.do_expire) {
      const syncDate = calculateDates(new Date(), { ...product, ...updates } as Product);
      await controller.updateAllBatchesForProduct(product.id, {
        expiry_at: syncDate.expiry,
        warn_at: product.do_warn ? syncDate.warn : null,
      });
    }

    await refreshProducts();
    setModalVisible(false);
  };

  return (
    <View style={infoStyles.container}>
      {/* PRICE */}
      <View style={[infoStyles.section, infoStyles.priceRow]}>
        <View style={infoStyles.priceInputContainer}>
          <ThemedText style={infoStyles.currencySymbol}>{CURRENCY_SYMBOL}</ThemedText>
          <EditableField
            value={`${product.price}.00` || "0.00"}
            onSave={async (val) => {
              await controller.updateProductField(product.id, "price", val);
              await refreshProducts();
            }}
            textStyle={infoStyles.priceValue}
          />
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={infoStyles.section}>
        <ThemedText style={infoStyles.label}>Description</ThemedText>
        <EditableField
          value={product.description || "No description provided."}
          onSave={async (val) => {
            await controller.updateProductField(product.id, "description", val);
            await refreshProducts();
          }}
          textStyle={infoStyles.description}
        />
      </View>

      {/* SETTINGS CARD */}
      <ThemedView style={[infoStyles.card, { backgroundColor: bgSecondary }]}>
        <View style={infoStyles.settingRow}>
          <View>
            <ThemedText style={infoStyles.title}>Track Expiry</ThemedText>
            <ThemedText style={infoStyles.sub}>Monitor shelf life</ThemedText>
          </View>
          <Switch
            value={product.do_expire === 1}
            onValueChange={(v) => handleToggle("do_expire", v)}
            trackColor={{ false: "#767577", true: bgPrimary }}
            thumbColor={product.do_expire === 1 ? accent : "#f4f3f4"}
          />
        </View>

        {product.do_expire === 1 && (
          <TouchableOpacity style={infoStyles.subRow} onPress={() => openPicker("shelf")}>
            <Ionicons name="calendar-outline" size={16} color={bgPrimary} />
            <ThemedText style={infoStyles.subText}>
              Shelf life{" "}
              <ThemedText style={infoStyles.subStrong}>
                {formatDuration({
                  years: product.shelf_life_years,
                  months: product.shelf_life_months,
                  days: product.shelf_life_days,
                  hours: product.shelf_life_hours,
                })}
              </ThemedText>
            </ThemedText>
            <MaterialIcons name="edit" size={16} color={bgPrimary} />
          </TouchableOpacity>
        )}

        <View style={infoStyles.settingRow}>
          <View>
            <ThemedText style={infoStyles.title}>Expiry Warnings</ThemedText>
            <ThemedText style={infoStyles.sub}>Notify before expiry</ThemedText>
          </View>
          <Switch
            disabled={product.do_expire === 0}
            value={product.do_warn === 1}
            onValueChange={(v) => handleToggle("do_warn", v)}
            trackColor={{ false: "#767577", true: bgPrimary }}
            thumbColor={product.do_warn === 1 ? accent : "#f4f3f4"}
          />
        </View>

        {product.do_warn === 1 && product.do_expire === 1 && (
          <TouchableOpacity style={infoStyles.subRow} onPress={() => openPicker("warn")}>
            <Ionicons name="notifications-outline" size={16} color={bgPrimary} />
            <ThemedText style={infoStyles.subText}>
              Warn{" "}
              <ThemedText style={infoStyles.subStrong}>
                {formatDuration({
                  months: product.warning_period_months,
                  days: product.warning_period_days,
                  hours: product.warning_period_hours,
                })}
              </ThemedText>{" "}
              before
            </ThemedText>
            <MaterialIcons name="edit" size={16} color={bgPrimary} />
          </TouchableOpacity>
        )}
      </ThemedView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={infoStyles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={infoStyles.modal}>
            <ThemedText style={infoStyles.modalTitle}>
              {activeField === "shelf" ? "Shelf Life" : "Warning Time"}
            </ThemedText>
            <TimeRangePicker
              accentColor={bgPrimary}
              initialValue={tempTime || undefined}
              startYear={0}
              endYear={10}
              hideYear={activeField === "warn"}
              onValueChange={setTempTime}
            />
            <TouchableOpacity
              style={[infoStyles.saveBtn, { backgroundColor: bgPrimary }]}
              onPress={handleSaveTime}
            >
              <ThemedText style={infoStyles.saveText}>Save</ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  container: { width: SCREEN_WIDTH, height: 320, position: "relative" },
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
  imageBtn: { right: 70, top: Platform.OS === "ios" ? 70 : 50 },
  rightBtn: { top: Platform.OS === "ios" ? 70 : 50, right: 20 },
  overlayInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#00000063",
  },
  editIconTitle: {
    marginLeft: 2,
    marginBottom: 3,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 4,
  },
  productTitle: {
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontSize: 18,
    fontWeight: "600",
  },
});

const infoStyles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 24 },
  section: { gap: 6 },
  label: { fontSize: 13, fontWeight: "700", opacity: 0.5 },
  description: { fontSize: 15, lineHeight: 22, opacity: 0.85 },

  priceRow: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  priceInputContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  currencySymbol: { fontSize: 18, fontWeight: "600", color: "#19a139ff" },
  priceValue: { fontSize: 20, fontWeight: "700", color: "#19a139ff" },

  card: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 14,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, opacity: 0.5 },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 10,
    borderRadius: 12,
  },
  subText: { fontSize: 13, opacity: 0.75, flex: 1 },
  subStrong: { fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    gap: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", textAlign: "center" },
  saveBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
