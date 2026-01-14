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
import { RemovedProductItem, QuickCustomerChip } from "@/components/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "@/contexts/TransactionContext";

interface Props {
  product: Product;
  onFinish: () => void;
}

const ProductSellSheet = ({ product, onFinish }: Props) => {
  const { customers, controller, refreshProducts } = useStock();
  const { refreshTransactions } = useTransactions();

  const [customerSearch, setCustomerSearch] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(1);
  const [processing, setProcessing] = useState(false);

  const toastRef = useRef<ToastRef>(null);

  const bgSecondary = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const textSub = useThemeColor({}, "text-subtitle");
  const sellColor = "#487d55";

  // 1. Searchable Customers Logic
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers.slice(0, 8); // Show first 8 by default
    return customers.filter((c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customerSearch, customers]);

  const handleConfirmRemoval = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      await controller.reduceStockWithLogic(product.id, quantity, "sale", {
        price: product.price,
        customerId: selectedCustomerId,
        note: `Sale of ${product.title}`,
      });

      await refreshProducts();
      await refreshTransactions();
      toastRef.current?.show("Sale processed successfully");
      setTimeout(onFinish, 500);
    } catch (error: any) {
      toastRef.current?.show(error.message || "Failed to process sale");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.sheetContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. SEARCHABLE CUSTOMER SECTION */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Select Customer
          </ThemedText>

          <View
            style={[
              styles.searchWrapper,
              { backgroundColor: bgSecondary, marginBottom: 12 },
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Search customers..."
              placeholderTextColor="gray"
              value={customerSearch}
              onChangeText={setCustomerSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalGap}
          >
            {filteredCustomers.map((c) => (
              <QuickCustomerChip
                key={c.id}
                customer={c}
                isSelected={selectedCustomerId === c.id}
                onPress={setSelectedCustomerId}
              />
            ))}
          </ScrollView>
        </View>

        {/* 2. PRODUCT DETAIL & QUANTITY */}
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Quantity to Sell
          </ThemedText>

          <RemovedProductItem
            product={product}
            quantity={quantity}
            onUpdateQty={setQuantity}
            onRemove={() => {}}
          />
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: processing ? "#ccc" : sellColor },
          ]}
          onPress={handleConfirmRemoval}
          disabled={processing || quantity <= 0}
        >
          <ThemedText style={styles.buttonText}>
            {processing ? "Processing..." : `Confirm Sale of ${quantity} Items`}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Toast ref={toastRef} />
    </View>
  );
};

export default ProductSellSheet;

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
