import React, { useState, useMemo, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/shared";
import Toast, { ToastRef } from "@/components/shared/Toast";
import { useStock } from "@/contexts/StockContext";
import { Product } from "@/types/stock";
import {
  RemovedProductItem,
  AddQuickProductChip,
  QuickCustomerChip,
} from "@/components/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "@/contexts/TransactionContext";

const RemoveStockSheet = ({ onFinish }: { onFinish: () => void }) => {
  const { products, customers, controller, refreshProducts } = useStock();
  const { refreshTransactions } = useTransactions();
  const [search, setSearch] = useState("");
  const [stagedItems, setStagedItems] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(1);

  const toastRef = useRef<ToastRef>(null);

  const bgSecondary = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const textSub = useThemeColor({}, "text-subtitle");
  const primaryBtn = useThemeColor({}, "background-muted");
  const sellColor = "#487d55";

  const availableProducts = useMemo(
    () => products.filter((p) => (p.total_stock ?? 0) > 0),
    [products]
  );

  const quickProducts = useMemo(() => {
    const pinned = availableProducts.filter((p) => p.is_pinned);
    return pinned.length > 0 ? pinned : availableProducts.slice(0, 5);
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return availableProducts
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, availableProducts]);

  const addToStaging = (product: Product) => {
    if (stagedItems.find((item) => item.product.id === product.id)) {
      toastRef.current?.show("Item already added");
      return;
    }
    setStagedItems((prev) => [...prev, { product, quantity: 1 }]);
    setSearch("");
    toastRef.current?.show(`Added ${product.title}`);
  };

  const handleConfirmRemoval = async () => {
    try {
      for (const item of stagedItems) {
        await controller.reduceStockWithLogic(
          item.product.id,
          item.quantity,
          "sale",
          {
            price: item.product.price,
            customerId: selectedCustomerId,
            note: `Mobile Sale`,
          }
        );
      }
      await refreshProducts();
      await refreshTransactions();
      toastRef.current?.show("Sale processed successfully");
      setTimeout(onFinish, 500);
    } catch (error: any) {
      toastRef.current?.show(error.message || "Failed to process sale");
    }
  };

  return (
    <View style={[styles.sheetContainer]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. CUSTOMER QUICK SELECT */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Select Customer
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalGap}
          >
            {customers.map((c) => (
              <QuickCustomerChip
                key={c.id}
                customer={c}
                isSelected={selectedCustomerId === c.id}
                onPress={setSelectedCustomerId}
              />
            ))}
          </ScrollView>
        </View>

        {/* 2. PRODUCT QUICK SELECT */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Quick Add Products
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalGap}
          >
            {quickProducts.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                No items currently in stock
              </ThemedText>
            ) : (
              quickProducts.map((p) => (
                <AddQuickProductChip
                  key={p.id}
                  product={p}
                  onPress={addToStaging}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* 3. SEARCH BOX */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Search All Stock
          </ThemedText>
          <View
            style={[styles.searchWrapper, { backgroundColor: bgSecondary }]}
          >
            <Ionicons
              name="search"
              size={18}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Type product name..."
              placeholderTextColor="gray"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {filteredProducts.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.searchResult}
              onPress={() => addToStaging(p)}
            >
              <View>
                <ThemedText type="defaultSemiBold">{p.title}</ThemedText>
                <ThemedText style={styles.subText}>
                  Available: {p.total_stock}
                </ThemedText>
              </View>
              <Ionicons name="add-circle" size={26} color="#487d55" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. STAGED ITEMS (The "Cart") */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Staged for Removal ({stagedItems.length})
          </ThemedText>
          {stagedItems.length === 0 ? (
            <View
              style={[styles.emptyContainer, { backgroundColor: bgSecondary }]}
            >
              <Ionicons
                name="bag-remove-outline"
                size={32}
                color={textColor}
                style={{ opacity: 0.2 }}
              />
              <ThemedText style={styles.emptyText}>
                Click a product to start
              </ThemedText>
            </View>
          ) : (
            stagedItems.map((item, index) => (
              <RemovedProductItem
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                onUpdateQty={(qty) => {
                  const newItems = [...stagedItems];
                  newItems[index].quantity = qty;
                  setStagedItems(newItems);
                }}
                onRemove={() =>
                  setStagedItems(stagedItems.filter((_, i) => i !== index))
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={[styles.footer, { backgroundColor: "transparent" }]}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: stagedItems.length > 0 ? sellColor : primaryBtn,
            },
          ]}
          onPress={handleConfirmRemoval}
          disabled={stagedItems.length === 0}
        >
          <ThemedText style={styles.buttonText}>
            Confirm & Process {stagedItems.length} Items
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Toast Instance */}
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: 5,
    paddingBottom: 25,
    paddingTop: 15,
  },
  scrollContent: { paddingBottom: 140 },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  horizontalGap: { gap: 12, paddingRight: 20 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 54,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  subText: { fontSize: 12, opacity: 0.5 },
  emptyContainer: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  emptyText: { opacity: 0.4, marginTop: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  primaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

export default RemoveStockSheet;
