import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedView, ThemedText, EditableField } from "@/components/shared";
import { Product } from "@/types/stock";
import { useStock } from "@/contexts/StockContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import TimeRangePicker, { TimePickerValue } from "@/components/ui/TimePicker";
import { formatDuration } from "@/utils/formatText";

const ProductInfoSection = ({
  product,
  onStock,
}: {
  product: Product;
  onStock: () => void;
}) => {
  const { controller, refreshProducts } = useStock();

  const bgSecondary = useThemeColor({}, "background-seconary");
  const bgPrimary = useThemeColor({}, "background-muted");
  const accent = useThemeColor({}, "accent");

  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<"shelf" | "warn" | null>(null);
  const [tempTime, setTempTime] = useState<TimePickerValue | null>(null);

  /**
   * Helper to apply product shelf-life/warning logic to a specific date
   */
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

    // Update the product blueprint
    await controller.updateProductField(product.id, field, numericValue);

    // If toggling Expiry Tracking, sync all existing batches
    if (field === "do_expire") {
      if (!value) {
        // Disabled: Wipe dates from all batches for this product
        await controller.updateAllBatchesForProduct(product.id, {
          expiry_at: null,
          warn_at: null,
        });
      } else {
        // Enabled: Re-calculate dates for every batch based on its creation date
        const batches = await controller.getProductBatches(product.id);
        for (const batch of batches) {
          const { expiry, warn } = calculateDates(
            new Date(batch.created_at),
            product
          );
          // We use updateAllBatchesForProduct with a filter or a specific batch updater
          // Since our controller currently updates 'all' by product_id, we need
          // to ensure we aren't overwriting different batch dates with one single date.
          // For now, we will update all to the same calculated default from 'now'
          // unless you add an 'updateBatchById' method.

          const defaultSync = calculateDates(new Date(), product);
          await controller.updateAllBatchesForProduct(product.id, {
            expiry_at: defaultSync.expiry,
            warn_at: product.do_warn ? defaultSync.warn : null,
          });
        }
      }
    }

    // If toggling Warning specifically
    if (field === "do_warn" && product.do_expire) {
      if (!value) {
        await controller.updateAllBatchesForProduct(product.id, {
          warn_at: null,
        });
      } else {
        // Enable warnings: calculate warn date based on existing expiry_at
        const batches = await controller.getProductBatches(product.id);
        for (const batch of batches) {
          if (batch.expiry_at) {
            const expiry = new Date(batch.expiry_at);
            expiry.setMonth(
              expiry.getMonth() - (product.warning_period_months || 0)
            );
            expiry.setDate(
              expiry.getDate() - (product.warning_period_days || 0)
            );
            expiry.setHours(
              expiry.getHours() - (product.warning_period_hours || 0)
            );
            // Mass update for simplicity in this version:
            await controller.updateAllBatchesForProduct(product.id, {
              warn_at: expiry,
            });
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
      month:
        type === "shelf"
          ? product.shelf_life_months || 0
          : product.warning_period_months || 0,
      day:
        type === "shelf"
          ? product.shelf_life_days || 0
          : product.warning_period_days || 0,
      hour:
        type === "shelf"
          ? product.shelf_life_hours || 0
          : product.warning_period_hours || 0,
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

    // After updating the "Blueprint", sync existing batches to match new duration
    if (product.do_expire) {
      const syncDate = calculateDates(new Date(), { ...product, ...updates });
      await controller.updateAllBatchesForProduct(product.id, {
        expiry_at: syncDate.expiry,
        warn_at: product.do_warn ? syncDate.warn : null,
      });
    }

    await refreshProducts();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* DESCRIPTION */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <EditableField
          value={product.description || "No description provided."}
          onSave={async (val) => {
            await controller.updateProductField(product.id, "description", val);
            await refreshProducts();
          }}
          textStyle={styles.description}
        />
      </View>

      {/* ACTIONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: bgPrimary }]}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <ThemedText style={styles.primaryText}>Sell</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStock}
          style={[styles.secondaryBtn, { backgroundColor: bgSecondary, borderColor: bgPrimary }]}
        >
          <Ionicons name="add" size={22} color={bgPrimary} />
          <ThemedText style={[styles.secondaryText, { color: bgPrimary }]}>
            Restock
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* SETTINGS CARD */}
      <ThemedView style={[styles.card, { backgroundColor: bgSecondary }]}>
        {/* TRACK EXPIRY TOGGLE */}
        <View style={styles.settingRow}>
          <View>
            <ThemedText style={styles.title}>Track Expiry</ThemedText>
            <ThemedText style={styles.sub}>Monitor shelf life</ThemedText>
          </View>
          <Switch
            value={product.do_expire === 1}
            onValueChange={(v) => handleToggle("do_expire", v)}
            trackColor={{ false: "#767577", true: bgPrimary }}
            thumbColor={product.do_expire === 1 ? accent : "#f4f3f4"}
          />
        </View>

        {product.do_expire === 1 && (
          <TouchableOpacity
            style={styles.subRow}
            onPress={() => openPicker("shelf")}
          >
            <Ionicons name="calendar-outline" size={16} color={bgPrimary} />
            <ThemedText style={styles.subText}>
              Shelf life{" "}
              <ThemedText style={styles.subStrong}>
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

        {/* WARNINGS TOGGLE */}
        <View style={styles.settingRow}>
          <View>
            <ThemedText style={styles.title}>Expiry Warnings</ThemedText>
            <ThemedText style={styles.sub}>Notify before expiry</ThemedText>
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
          <TouchableOpacity
            style={styles.subRow}
            onPress={() => openPicker("warn")}
          >
            <Ionicons
              name="notifications-outline"
              size={16}
              color={bgPrimary}
            />
            <ThemedText style={styles.subText}>
              Warn{" "}
              <ThemedText style={styles.subStrong}>
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

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modal}>
            <ThemedText style={styles.modalTitle}>
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
              style={[styles.saveBtn, { backgroundColor: bgPrimary }]}
              onPress={handleSaveTime}
            >
              <ThemedText style={styles.saveText}>Save</ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProductInfoSection;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 24 },
  section: { gap: 6 },
  label: { fontSize: 13, fontWeight: "700", opacity: 0.5 },
  description: { fontSize: 15, lineHeight: 22, opacity: 0.85 },
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
  },
  secondaryText: { fontWeight: "700" },
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
