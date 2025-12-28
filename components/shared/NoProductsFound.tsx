import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";

const NoProductsFound: React.FC = () => {
  const sheetBg = useThemeColor({}, "sheet");

  const onAddProduct = () => {
    router.push("/add-product");
  };
  
  return (
    <View style={[styles.container, { backgroundColor: sheetBg }]}>
      <ThemedText type="subtitle" style={styles.title}>
        No products found
      </ThemedText>

      <ThemedText style={styles.description}>
        You haven’t added any products yet. Start by adding your first product
        to manage stock and sales.
      </ThemedText>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onAddProduct}
      >
        <ThemedText style={styles.buttonText}>
          Add your first product
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default NoProductsFound;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "#6f6f6fff",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
