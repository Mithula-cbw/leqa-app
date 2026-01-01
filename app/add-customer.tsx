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

export default function AddCustomerScreen() {
  const { controller } = useStock();
  const bgSecondary = useThemeColor({}, "background-seconary");
  const tint = useThemeColor({}, "background-muted");
  const iconMuted = useThemeColor({}, "icon");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    image: null as string | null,
  });

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
    if (!form.name.trim()) {
      Alert.alert("Required Field", "Customer name is required.");
      return;
    }

    try {
      await controller.createCustomer(
        form.name.trim(),
        form.image || null,
        form.phone || null,
        form.email || null
      );

      router.back();
    } catch (e: any) {
      console.error("Database Error:", e);
      Alert.alert(
        "Error",
        "Could not save customer. Check console for details."
      );
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CIRCULAR AVATAR PICKER */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={[styles.circularPicker, { backgroundColor: bgSecondary }]}
            onPress={handlePickImage}
          >
            {form.image ? (
              <Image
                source={{ uri: form.image }}
                style={styles.previewAvatar}
              />
            ) : (
              <View style={styles.initialsContainer}>
                {form.name ? (
                  <ThemedText style={[styles.initialsText, { color: tint }]}>
                    {form.name.charAt(0).toUpperCase()}
                  </ThemedText>
                ) : (
                  <Ionicons
                    name="person-add-outline"
                    size={40}
                    color={iconMuted}
                  />
                )}
              </View>
            )}

            <View style={[styles.cameraBadge, { backgroundColor: tint }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <ThemedText style={styles.avatarLabel}>Customer Photo</ThemedText>
        </View>

        {/* INPUTS */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: bgSecondary }]}
            placeholder="e.g. Mithula Chanthuka"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Phone Number</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: bgSecondary }]}
            placeholder="07X XXX XXXX"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email Address (Optional)</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: bgSecondary }]}
            placeholder="customer@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: tint }]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveText}>Save Customer</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, gap: 20, paddingBottom: 100 },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  initialsContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  initialsText: {
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 56,
    marginLeft: 3,
  },
  circularPicker: {
    width: 120,
    height: 120,
    borderRadius: 60, // Perfect circle
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    position: "relative",
  },
  previewAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.6,
    marginBottom: 8,
  },
  inputGroup: { width: "100%" },
  input: {
    padding: 18,
    borderRadius: 18,
    fontSize: 16,
  },
  spacer: { flex: 1, minHeight: 40 },
  saveBtn: {
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
});
