import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { Product } from "@/types/stock";
import { AddedProductItem, AddQuickProductChip } from "@/components/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { addTime } from "@/utils/addTime";

interface StagedProduct {
  product: Product;
  quantity: number;
  expiryDate: Date;
  warnDate: Date;
}

const AddStockSheet = ({ onFinish }: { onFinish: () => void }) => {
  const { products, controller, refreshProducts } = useStock();
  const [search, setSearch] = useState("");
  const [stagedItems, setStagedItems] = useState<StagedProduct[]>([]);

  const bgSecondary = useThemeColor({}, "background-seconary");
  const inputBg = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const textSub = useThemeColor({}, "text-subtitle");
  const primaryBtn = useThemeColor({}, "background-muted");
  const primaryBtnActive = "#487d55ff";

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, products]);

  const displayData = useMemo(() => {
    const pinned = products.filter((p) => p.is_pinned === 1);
    return pinned.length > 0 ? pinned : products.slice(0, 2);
  }, [products]);

  const addProductToStaging = (product: Product) => {
    if (stagedItems.find((item) => item.product.id === product.id)) return;

    const shelfValue = product.shelf_life_value ?? 7;
    const shelfUnit = product.shelf_life_unit ?? "days";
    const expiryDate = addTime(new Date(), shelfValue, shelfUnit);

    const warnValue =
      product.warning_period_value ?? Math.ceil(shelfValue * 0.1);
    const warnUnit = product.warning_period_unit ?? "days";
    const warnDate = addTime(expiryDate, -warnValue, warnUnit);

    setStagedItems([
      ...stagedItems,
      {
        product,
        quantity: 1,
        expiryDate: expiryDate,
        warnDate: warnDate,
      },
    ]);
    setSearch("");
  };

  const handleSaveAll = async () => {
    if (stagedItems.length === 0) return;

    const sharedBatchId = Math.floor(Date.now() / 1000);

    try {
      for (const item of stagedItems) {
        await controller.addStockBatch(
          item.product.id,
          item.quantity,
          item.expiryDate,
          item.warnDate,
          sharedBatchId
        );
      }

      await refreshProducts();
      onFinish();
    } catch (error) {
      console.error("Failed to save batch", error);
      // dev
    }
  };

  return (
    <View style={styles.sheetContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Added to Batch
          </ThemedText>
          {stagedItems.length === 0 ? (
            <View
              style={[styles.emptyContainer, { backgroundColor: bgSecondary }]}
            >
              <Ionicons
                name="cart-outline"
                size={24}
                color={textColor}
                style={{ opacity: 0.3 }}
              />
              <ThemedText style={styles.emptyText}>
                No products selected yet
              </ThemedText>
            </View>
          ) : (
            stagedItems.map((item, index) => (
              <AddedProductItem
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                expiryDate={item.expiryDate}
                warnDate={item.warnDate}
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
                onUpdateWarn={(date) => {
                  const newItems = [...stagedItems];
                  newItems[index].warnDate = date;
                  setStagedItems(newItems);
                }}
                onRemove={() =>
                  setStagedItems(stagedItems.filter((_, i) => i !== index))
                }
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Quick Add
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {displayData.map((p) => (
              <AddQuickProductChip
                key={p.id}
                product={p}
                onPress={addProductToStaging}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Search Products
          </ThemedText>
          <View style={[styles.searchWrapper, { backgroundColor: inputBg }]}>
            <Ionicons
              name="search"
              size={18}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
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
                <ThemedText style={styles.subText}>{`${product.weight_value} ${
                  product.weight_unit ?? "g"
                }`}</ThemedText>
              </View>
              <Ionicons name="add-circle" size={24} color={primaryBtn} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                stagedItems.length > 0 ? primaryBtnActive : primaryBtn,
            },
          ]}
          onPress={handleSaveAll}
          disabled={stagedItems.length === 0}
        >
          <ThemedText style={styles.buttonText}>
            Confirm & Save Batch
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddStockSheet;

const styles = StyleSheet.create({
  sheetContainer: { paddingHorizontal: 0, paddingTop: 5 },
  header: { marginBottom: 20 },
  scrollContent: { paddingBottom: 100 },
  section: { marginBottom: 25 },
  sectionLabel: {
    fontSize: 14,
    textTransform: "uppercase",
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
  emptyText: { opacity: 0.4, fontSize: 14 },
  pinnedScroll: { flexDirection: "row" },
  quickCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    width: 220,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  quickThumb: { width: 45, height: 45, borderRadius: 10 },
  quickPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  quickInfo: { flex: 1, justifyContent: "center" },
  quickSubText: { fontSize: 12, opacity: 0.6 },
  quickAddIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 10,
  },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  subText: { fontSize: 13, opacity: 0.5 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
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
  buttonText: { fontWeight: "700", fontSize: 16, color: "#fff" },
});
