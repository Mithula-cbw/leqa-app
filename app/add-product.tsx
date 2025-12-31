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

export default function AddProductScreen() {
  const { controller, refreshProducts } = useStock();
  const bgSecondary = useThemeColor({}, "background-seconary");
  const tint = "#9e7913ff";

  const [form, setForm] = useState({
    title: "",
    weight_value: 0,
    weight_unit: "g" as "g" | "kg",
    price: "",
    shelfLifeValue: 7,
    shelfLifeUnit: "days" as "days" | "hours",
    warningPeriodValue: 1,
    warningPeriodUnit: "days" as "days" | "hours",
    initialStock: 0,
    image: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.weight_value || !form.price) {
      Alert.alert("Required Fields", "Name, Weight and Price are required.");
      return;
    }

    try {
      const result = await controller.createProduct(
        form.title,
        "",
        form.weight_value,
        form.weight_unit,
        parseFloat(form.price),
        form.image,
        form.shelfLifeValue,
        form.shelfLifeUnit,
        form.warningPeriodValue,
        form.warningPeriodUnit
      );

      if (form.initialStock > 0) {
        const expiry = new Date();
        if (form.shelfLifeUnit === "days") {
          expiry.setDate(expiry.getDate() + form.shelfLifeValue);
        } else {
          expiry.setHours(expiry.getHours() + form.shelfLifeValue);
        }

        const warn = new Date(expiry);
        warn.setDate(warn.getDate() - form.warningPeriodValue);

        await controller.addStockBatch(
          result.lastInsertRowId,
          form.initialStock,
          expiry,
          warn
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* IMAGE PICKER */}
        <TouchableOpacity
          style={[styles.imagePicker, { backgroundColor: bgSecondary }]}
          onPress={pickImage}
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

        {/* PRODUCT NAME */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Product Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: bgSecondary }]}
            placeholder="e.g. Oyster Mushrooms"
            value={form.title}
            onChangeText={(t) => setForm({ ...form, title: t })}
          />
        </View>

        {/* PRICE + WEIGHT ROW */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <ThemedText style={styles.label}>Price ($)</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgSecondary }]}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1.2 }]}>
            <ThemedText style={styles.label}>Weight</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: bgSecondary }]}>
              <TextInput
                style={styles.flexInput}
                keyboardType="numeric"
                placeholder="0"
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
        </View>

        {/* STOCK + SHELF LIFE ROW */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <ThemedText style={styles.label}>Stock Qty</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgSecondary }]}
              placeholder="0"
              keyboardType="number-pad"
              value={form.initialStock === 0 ? "" : String(form.initialStock)}
              onChangeText={(v) =>
                setForm({ ...form, initialStock: parseInt(v) || 0 })
              }
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1.2 }]}>
            <ThemedText style={styles.label}>Shelf Life</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: bgSecondary }]}>
              <TextInput
                style={styles.flexInput}
                keyboardType="numeric"
                placeholder="7"
                value={String(form.shelfLifeValue)}
                onChangeText={(v) =>
                  setForm({ ...form, shelfLifeValue: parseInt(v) || 0 })
                }
              />
              <View style={styles.unitToggleContainer}>
                {(["days", "hours"] as const).map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setForm({ ...form, shelfLifeUnit: u })}
                    style={[
                      styles.unitSmallBtn,
                      form.shelfLifeUnit === u && { backgroundColor: tint },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.unitSmallText,
                        form.shelfLifeUnit === u && { color: "#fff" },
                      ]}
                    >
                      {u === "days" ? "D" : "H"}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <ThemedText style={styles.saveText}>Complete Product</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 20 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.6,
    marginBottom: 6,
    marginLeft: 4,
  },
  labelHint: { fontSize: 12, opacity: 0.4, marginTop: 4 },
  inputGroup: { flex: 0 },

  imagePicker: {
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 20 },

  input: {
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
  },
  flexInput: { flex: 1, fontSize: 16, fontWeight: "500", height: "100%" },

  row: { flexDirection: "row", gap: 12 },

  unitToggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    padding: 3,
  },
  unitSmallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  unitSmallText: { fontSize: 11, fontWeight: "bold", color: "#666" },

  saveBtn: {
    backgroundColor: "#9e7913ff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
