import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { Product } from "@/types/stock";
import { AddedProductItem } from "@/components/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface StagedProduct {
  product: Product;
  quantity: number;
  expiryDate: string;
}

const AddStockSheet = ({ onFinish }: { onFinish: () => void }) => {
  const { products, controller, refreshProducts } = useStock();
  const [search, setSearch] = useState("");
  const [stagedItems, setStagedItems] = useState<StagedProduct[]>([]);

  // Theme Colors
  const bgSecondary = useThemeColor({}, "background-seconary");
  const inputBg = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const primaryBtn = "#28a745"; // Success green

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, products]);

  const pinnedProducts = useMemo(() => {
    return products.filter((p) => p.total_stock > 0).slice(0, 6);
  }, [products]);

  const addProductToStaging = (product: Product) => {
    if (stagedItems.find((item) => item.product.id === product.id)) return;
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + (product.default_shelf_life ?? 7));

    setStagedItems([
      ...stagedItems,
      {
        product,
        quantity: 1,
        expiryDate: defaultExpiry.toISOString().split("T")[0],
      },
    ]);
    setSearch("");
  };

  const handleSaveAll = async () => {
    for (const item of stagedItems) {
      await controller.addStockBatch(item.product.id, item.quantity, item.expiryDate);
    }
    await refreshProducts();
    onFinish();
  };

  return (
    <View style={styles.sheetContainer}>
      {/* HEADER SECTION - Based on Inspiration */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Update Stock</ThemedText>
        <ThemedText style={styles.subtitle}>Add multiple products to your inventory batch.</ThemedText>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* SECTION 1: ADDED PRODUCTS */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Added to Batch</ThemedText>
          {stagedItems.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: bgSecondary }]}>
              <Ionicons name="cart-outline" size={24} color={textColor} style={{ opacity: 0.3 }} />
              <ThemedText style={styles.emptyText}>No products selected yet</ThemedText>
            </View>
          ) : (
            stagedItems.map((item, index) => (
              <AddedProductItem
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                expiryDate={item.expiryDate}
                onUpdateQty={(qty) => {
                  const newItems = [...stagedItems];
                  newItems[index].quantity = qty;
                  setStagedItems(newItems);
                }}
                onUpdateExpiry={(date) => {
                  const newItems = [...stagedItems];
                  newItems[index].expiryDate = date;
                  setStagedItems(newItems);
                }}
                onRemove={() => setStagedItems(stagedItems.filter((_, i) => i !== index))}
              />
            ))
          )}
        </View>

        {/* SECTION 2: PINNED/QUICK ADD */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Quick Add</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pinnedScroll}>
            {pinnedProducts.map((p) => (
              <TouchableOpacity 
                key={p.id} 
                style={[styles.chip, { backgroundColor: bgSecondary }]}
                onPress={() => addProductToStaging(p)}
              >
                <ThemedText style={styles.chipText}>{p.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 3: SEARCHABLE LIST */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Search Products</ThemedText>
          <View style={[styles.searchWrapper, { backgroundColor: inputBg }]}>
            <Ionicons name="search" size={18} color={textColor} style={{ opacity: 0.5 }} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Search by name..."
              placeholderTextColor="gray"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.searchResult}
              onPress={() => addProductToStaging(product)}
            >
              <View>
                <ThemedText type="defaultSemiBold">{product.title}</ThemedText>
                <ThemedText style={styles.subText}>{product.weight}</ThemedText>
              </View>
              <Ionicons name="add-circle" size={24} color={primaryBtn} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER: ACTION BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: primaryBtn, opacity: stagedItems.length > 0 ? 1 : 0.5 }]}
          onPress={handleSaveAll}
          disabled={stagedItems.length === 0}
        >
          <ThemedText style={styles.buttonText}>Confirm & Save Batch</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddStockSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.6,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    opacity: 0.5,
    marginBottom: 10,
    letterSpacing: 1,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  emptyText: {
    opacity: 0.4,
    fontSize: 14,
  },
  pinnedScroll: {
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  subText: {
    fontSize: 13,
    opacity: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "white", // Should ideally be theme-aware background
  },
  primaryButton: {
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});