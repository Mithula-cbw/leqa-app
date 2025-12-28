// Leqa © 2025 Mithula Chanthuka
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView, ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { router } from "expo-router";

export default function AddProductScreen() {
  const { controller, refreshProducts } = useStock();

  const [form, setForm] = useState({
    title: "",
    weight: "",
    price: "",
    shelfLife: "7",
    initialStock: "0",
    image: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    const { title, weight, price, shelfLife, initialStock, image } = form;

    if (!title || !weight || !price) {
      Alert.alert("Required Fields", "Please fill in Name, Weight, and Price.");
      return;
    }

    try {
      // 1. Create the Product Blueprint
      // Note: is_pinned and sort_order are handled by DB defaults (0)
      const result = await controller.createProduct(
        title,
        "", // description
        weight,
        parseFloat(price),
        image,
        parseInt(shelfLife)
      );

      // 2. Add Initial Stock if provided
      const stockQty = parseInt(initialStock);
      if (stockQty > 0) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + parseInt(shelfLife));
        
        // Use the insertId from the created product
        await controller.addStockBatch(result.lastInsertRowId, stockQty, expiry.toISOString());
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
        
        {/* Image Picker Section */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={{ fontSize: 40 }}>📸</ThemedText>
              <ThemedText style={styles.subText}>Add Product Photo</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        <ThemedText style={styles.label}>Product Name *</ThemedText>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Oyster Mushrooms" 
          value={form.title}
          onChangeText={(t) => setForm({...form, title: t})}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Weight *</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="250g" 
              value={form.weight}
              onChangeText={(t) => setForm({...form, weight: t})}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.label}>Price ($) *</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="5.00" 
              keyboardType="numeric"
              value={form.price}
              onChangeText={(t) => setForm({...form, price: t})}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>Initial Stock</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="0" 
              keyboardType="numeric"
              value={form.initialStock}
              onChangeText={(t) => setForm({...form, initialStock: t})}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.label}>Shelf Life (Days)</ThemedText>
            <TextInput 
              style={styles.input} 
              placeholder="7" 
              keyboardType="numeric"
              value={form.shelfLife}
              onChangeText={(t) => setForm({...form, shelfLife: t})}
            />
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
  label: { fontSize: 13, opacity: 0.6, marginBottom: 5, fontWeight: '600' },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#ccc'
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  subText: { fontSize: 12, opacity: 0.5, marginTop: 5 },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});