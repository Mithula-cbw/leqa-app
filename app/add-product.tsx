// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedView, ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import TimeRangePicker from "@/components/ui/TimePicker";

export default function AddProductScreen() {
  const { controller, refreshProducts } = useStock();
  const bgSecondary = useThemeColor({}, "background-seconary");
  const tint =  useThemeColor({}, "background-muted");

  const [form, setForm] = useState({
    title: "",
    weight_value: 0,
    weight_unit: "g" as "g" | "kg",
    price: "",
    initialStock: "",
    image: null as string | null,
    doExpire: 0 as 0 | 1,
    shelfLife: {
      year: 0,
      month: 0,
      day: 7,
      hour: 0,
    },
    doWarn: 0 as 0 | 1,
    warningPeriod: {
      year: 0,
      month: 0,
      day: 1,
      hour: 0,
    },
  });

  // --- Helpers ---

  const toggleExpire = () => {
    setForm((prev) => ({
      ...prev,
      doExpire: prev.doExpire === 1 ? 0 : 1,
      // Automatically turn off warning if expiration is disabled
      doWarn: prev.doExpire === 1 ? 0 : prev.doWarn,
    }));
  };

  const toggleWarning = () => {
    if (form.doExpire === 0) {
      Alert.alert(
        "Notice",
        "Please enable 'Item Expires' first to set a warning."
      );
      return;
    }
    setForm((prev) => ({ ...prev, doWarn: prev.doWarn === 1 ? 0 : 1 }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.weight_value || !form.price) {
      Alert.alert("Required Fields", "Name, Weight and Price are required.");
      return;
    }

    const stockNum = parseInt(form.initialStock, 10);

    if (isNaN(stockNum)) {
      Alert.alert("Invalid Input", "Stock must be a valid number.");
      return;
    }

    try {
      const isWarnActive = form.doWarn === 1;
      const isExpireActive = form.doExpire === 1;

      // Ensure data is 0 if features are disabled
      const shelfY = isExpireActive ? form.shelfLife.year : 0;
      const shelfM = isExpireActive ? form.shelfLife.month : 0;
      const shelfD = isExpireActive ? form.shelfLife.day : 0;
      const shelfH = isExpireActive ? form.shelfLife.hour : 0;

      const warnM = isWarnActive ? form.warningPeriod.month : 0;
      const warnD = isWarnActive ? form.warningPeriod.day : 0;
      const warnH = isWarnActive ? form.warningPeriod.hour : 0;

      const result = await controller.createProduct(
        form.title,
        "",
        form.weight_value,
        form.weight_unit,
        parseFloat(form.price),
        form.image,
        form.doExpire,
        shelfY,
        shelfM,
        shelfD,
        shelfH,
        form.doWarn,
        warnM,
        warnD,
        warnH
      );

      if (stockNum > 0) {
        let expiry: Date | null = null;
        let warnDate: Date | null = null;

        if (isExpireActive) {
          expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + shelfY);
          expiry.setMonth(expiry.getMonth() + shelfM);
          expiry.setDate(expiry.getDate() + shelfD);
          expiry.setHours(expiry.getHours() + shelfH);

          warnDate = new Date(expiry);
          if (isWarnActive) {
            warnDate.setMonth(warnDate.getMonth() - warnM);
            warnDate.setDate(warnDate.getDate() - warnD);
            warnDate.setHours(warnDate.getHours() - warnH);
          }
        }

        await controller.addStockBatch(
          result.lastInsertRowId,
          stockNum,
          expiry,
          warnDate
        );
      }

      await refreshProducts();
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* IMAGE PICKER */}
        <TouchableOpacity
          style={[styles.imagePicker, { backgroundColor: bgSecondary }]}
          onPress={handlePickImage}
        >
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera-outline" size={32} color={tint} />
              <ThemedText style={styles.labelHint}>
                Add Product Image
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Product Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: bgSecondary }]}
            placeholder="e.g. Fresh Milk"
            value={form.title}
            onChangeText={(t) => setForm({ ...form, title: t })}
          />
        </View>

        {/* PRICE & INITIAL STOCK ROW */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Price (LKR)</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgSecondary }]}
              keyboardType="decimal-pad"
              value={form.price}
              placeholder="0.00"
              onChangeText={(t) => setForm({ ...form, price: t })}
            />
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Initial Stock</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgSecondary }]}
              keyboardType="number-pad"
              value={form.initialStock}
              placeholder="Qty"
              onChangeText={(t) =>
                setForm({ ...form, initialStock: t.replace(/[^0-9]/g, "") })
              }
            />
          </View>
        </View>

        {/* WEIGHT ROW */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Weight</ThemedText>
          <View style={[styles.inputRow, { backgroundColor: bgSecondary }]}>
            <TextInput
              style={styles.flexInput}
              keyboardType="numeric"
              placeholder="000"
              value={form.weight_value === 0 ? "" : String(form.weight_value)}
              onChangeText={(t) =>
                setForm({ ...form, weight_value: parseFloat(t) || 0 })
              }
            />
            <View style={styles.unitToggleContainer}>
              {(["g", "kg"] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setForm({ ...form, weight_unit: u })}
                  style={[
                    styles.unitSmallBtn,
                    form.weight_unit === u && { backgroundColor: tint },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.unitSmallText,
                      form.weight_unit === u && { color: "#fff" },
                    ]}
                  >
                    {u}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* SECTION: EXPIRATION TOGGLE */}
        <TouchableOpacity
          style={styles.tickRow}
          onPress={toggleExpire}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.tickBox,
              { borderColor: form.doExpire === 1 ? tint : "#ccc" },
              form.doExpire === 1 && { backgroundColor: tint },
            ]}
          >
            {form.doExpire === 1 && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </View>
          <ThemedText style={styles.tickTitle}>Item Expires</ThemedText>
        </TouchableOpacity>

        {form.doExpire === 1 && (
          <View style={styles.pickerSection}>
            <View style={styles.warningBox}>
              <Ionicons
                name="information-circle"
                size={20}
                color="#004f99de"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={styles.warningText}>
                Set how long this product stays fresh.
              </ThemedText>
            </View>
            <TimeRangePicker
              startYear={0}
              endYear={10}
              initialValue={form.shelfLife}
              onValueChange={(v) => setForm({ ...form, shelfLife: v })}
              accentColor={tint}
            />
          </View>
        )}

        {/* SECTION: WARNING TOGGLE (Only active if item expires) */}
        <TouchableOpacity
          style={[styles.tickRow, form.doExpire === 0 && { opacity: 0.4 }]}
          onPress={toggleWarning}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.tickBox,
              { borderColor: form.doWarn === 1 ? tint : "#ccc" },
              form.doWarn === 1 && { backgroundColor: tint },
            ]}
          >
            {form.doWarn === 1 && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </View>
          <ThemedText style={styles.tickTitle}>
            Enable Expiry Warning
          </ThemedText>
        </TouchableOpacity>

        {form.doWarn === 1 && form.doExpire === 1 && (
          <View style={styles.pickerSection}>
            <View style={styles.warningBox}>
              <Ionicons
                name="information-circle"
                size={20}
                color="#004f99de"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={styles.warningText}>
                How long before expiry should we notify you?
              </ThemedText>
            </View>
            <TimeRangePicker
              startYear={0}
              endYear={0}
              initialValue={form.warningPeriod}
              onValueChange={(v) => setForm({ ...form, warningPeriod: v })}
              accentColor={tint}
              hideYear={true}
            />
          </View>
        )}

        <TouchableOpacity style={[styles.saveBtn, {backgroundColor: tint}]} onPress={handleSave}>
          <ThemedText style={styles.saveText}>Create Product</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 24, paddingBottom: 100 },
  label: { fontSize: 13, fontWeight: "700", opacity: 0.6, marginBottom: 8 },
  labelHint: { fontSize: 11, opacity: 0.5, marginTop: 4, textAlign: "center" },
  pickerSection: { gap: 8 },
  imagePicker: {
    height: 140,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    borderStyle: "dashed",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 24 },
  input: { padding: 16, borderRadius: 16, fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  flexInput: { flex: 1, fontSize: 16 },
  row: { flexDirection: "row", gap: 12 },
  unitToggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 4,
  },
  unitSmallBtn: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 10 },
  unitSmallText: { fontSize: 14, fontWeight: "bold", color: "#666" },
  tickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  tickBox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tickTitle: { fontSize: 15, fontWeight: "600" },
  inputGroup: { width: "100%", marginBottom: 4 },
  saveBtn: {
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6f5f32ff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#004f99de",
    backgroundColor: "#004f9920",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  warningText: { fontSize: 12, color: "#5d5c5cff", flex: 1, lineHeight: 16 },
});
