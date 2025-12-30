// Leqa © 2025 Mithula Chanthuka

import { useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText, ThemedView } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CustomersContent, ProductsContent } from "@/features/products";

type TabKey = "products" | "customers";

const Products = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const router = useRouter();

  const tabsBg = useThemeColor({}, "background-seconary");
  const activeBg = useThemeColor({}, "background");
  const accent = useThemeColor({}, "accent");
  const textColorAdd = useThemeColor({}, "text");

  const onAdd = () => {
    if (activeTab === "products") {
      router.push("/add-product");
    } else {
      console.log('/add cutomer)');
    }
  };

  return (
    <ThemedView style={[styles.container, {backgroundColor: tabsBg}]}>
      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: tabsBg }]}>
        {(["products", "customers"] as TabKey[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab ? activeBg : tabsBg,
              },
            ]}
          >
            <ThemedText style={styles.tabText}>
              {tab === "products" ? "Products" : "Customers"}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ThemedView style={styles.content}>
        {activeTab === "products" ? (
          <ProductsContent />
        ) : (
          <CustomersContent />
        )}
      </ThemedView>

      {/* Floating Action Button */}
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          styles.fab,
          styles.add,
          {
            backgroundColor: accent,
            transform: [{ scale: pressed ? 0.96 : 1 }],
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={40} color={textColorAdd} />
      </Pressable>
    </ThemedView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },

  tabs: {
    flexDirection: "row",
    marginTop: 45,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  tab: {
    flex: 1,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
  },

  tabText: {
    fontWeight: "600",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 110,

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  add: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginTop: 18,
  },
});
