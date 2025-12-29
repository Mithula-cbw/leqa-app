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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView, ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import { WheelPicker } from "@/components/ui/WheelPicker";

export default function AddProductScreen() {
  const { controller, refreshProducts } = useStock();
  const bgInput = useThemeColor({}, "background-seconary");

  const [form, setForm] = useState({
    title: "",
    weight: "",
    price: "",
    shelfLifeValue: 7,
    shelfLifeUnit: "days" as "days" | "hours",
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
    const {
      title,
      weight,
      price,
      shelfLifeValue,
      shelfLifeUnit,
      initialStock,
      image,
    } = form;

    if (!title || !weight || !price) {
      Alert.alert("Required Fields", "Please fill in Name, Weight, and Price.");
      return;
    }

    try {
      const result = await controller.createProduct(
        title,
        "",
        weight,
        parseFloat(price),
        image,
        shelfLifeValue,
        shelfLifeUnit
      );

      if (initialStock > 0) {
        const expiry = new Date();
        if (shelfLifeUnit === "hours") {
          expiry.setHours(expiry.getHours() + shelfLifeValue);
        } else {
          expiry.setDate(expiry.getDate() + shelfLifeValue);
        }

        await controller.addStockBatch(
          result.lastInsertRowId,
          initialStock,
          expiry.toISOString()
        );
      }

      await refreshProducts();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={[styles.imagePicker, { backgroundColor: bgInput }]}
          onPress={pickImage}
        >
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={{ fontSize: 40 }}>📸</ThemedText>
              <ThemedText style={styles.subText}>Add Product Photo</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        <ThemedText style={[styles.label, {marginBottom: -8} ]}>Product Name *</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: bgInput }]}
          placeholder="e.g. Oyster Mushrooms"
          value={form.title}
          onChangeText={(t) => setForm({ ...form, title: t })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Weight *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgInput }]}
              placeholder="250g"
              value={form.weight}
              onChangeText={(t) => setForm({ ...form, weight: t })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.label}>Price ($) *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: bgInput }]}
              placeholder="5.00"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
            />
          </View>
        </View>

        <View style={styles.row}>
          {/* Reusable Roller for Stock */}
          <WheelPicker
            label="Initial Stock"
            value={form.initialStock}
            range={100}
            onValueChange={(val) => setForm({ ...form, initialStock: val })}
          />

          {/* Roller + Unit Switcher for Shelf Life */}
          <View style={{ flex: 1.2, marginLeft: 10 }}>
            <ThemedText style={styles.label}>Shelf Life</ThemedText>
            <View style={[styles.shelfLifeBox, { backgroundColor: bgInput }]}>
              <WheelPicker
                label=""
                value={form.shelfLifeValue}
                range={99}
                onValueChange={(v) => setForm({ ...form, shelfLifeValue: v })}
              />
              <View style={styles.unitSelector}>
                {(["days", "hours"] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setForm({ ...form, shelfLifeUnit: unit })}
                    style={[
                      styles.unitBtn,
                      form.shelfLifeUnit === unit && styles.activeUnit,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.unitText,
                        form.shelfLifeUnit === unit && styles.activeUnitText,
                      ]}
                    >
                      {unit}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <ThemedText style={styles.saveText}>Save Product</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, gap: 15 },
  label: { fontSize: 13, opacity: 0.6, marginBottom: 5, fontWeight: "600" },
  input: { padding: 15, borderRadius: 12, fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  imagePicker: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  previewImage: { width: "100%", height: "100%" },
  imagePlaceholder: { alignItems: "center" },
  subText: { fontSize: 12, opacity: 0.5, marginTop: 5 },
  shelfLifeBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    height: 120,
    paddingRight: 10,
  },
  unitSelector: { gap: 8 },
  unitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  activeUnit: { backgroundColor: "#007AFF" },
  unitText: { fontSize: 12, textTransform: "capitalize" },
  activeUnitText: { color: "#FFF", fontWeight: "bold" },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
