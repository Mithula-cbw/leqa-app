// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "@/components/shared";
import { useStock } from "@/contexts/StockContext";
import { Product } from "@/types/stock";
import { AddedProductItem } from "@/components/home";
import { useThemeColor } from "@/hooks/use-theme-color";
import { addDuration } from "@/utils/addDuration";

interface SingleProductRestockProps {
  product: Product;
  onFinish: () => void;
}

const ProductRestockSheet = ({
  product,
  onFinish,
}: SingleProductRestockProps) => {
  const { controller, refreshProducts } = useStock();

  const textSub = useThemeColor({}, "text-subtitle");
  const primaryBtnActive = "#487d55ff";
  const sheetBg = useThemeColor({}, "sheet");

  const getInitialDates = () => {
    const now = new Date();
    let expiryDate: Date | null = null;
    let warnDate: Date | null = null;

    if (product.do_expire) {
      expiryDate = addDuration(now, {
        years: product.shelf_life_years ?? 0,
        months: product.shelf_life_months ?? 1,
        days: product.shelf_life_days ?? 0,
        hours: product.shelf_life_hours ?? 0,
      });

      if (product.do_warn) {
        warnDate = addDuration(expiryDate, {
          months: -(product.warning_period_months ?? 0),
          days: -(product.warning_period_days ?? 1),
          hours: -(product.warning_period_hours ?? 0),
        });
      }
    }
    return { expiryDate, warnDate };
  };

  const [quantity, setQuantity] = useState(1);
  const [dates, setDates] = useState(getInitialDates());

  const handleSave = async () => {
    const sharedBatchId = Math.floor(Date.now() / 1000);
    try {
      await controller.addStockBatch(
        product.id,
        quantity,
        product.do_expire ? dates.expiryDate : null,
        product.do_warn && product.do_expire ? dates.warnDate : null,
        sharedBatchId
      );
      await refreshProducts();
      onFinish();
    } catch (error) {
      console.error("Failed to save stock batch", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: sheetBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionLabel, { color: textSub }]}
          >
            Stock Entry Details
          </ThemedText>

          <AddedProductItem
            product={product}
            quantity={quantity}
            expiryDate={dates.expiryDate}
            warnDate={dates.warnDate}
            onUpdateQty={setQuantity}
            onUpdateExpiry={(date) =>
              setDates((prev) => ({ ...prev, expiryDate: date }))
            }
            onUpdateWarn={(date) =>
              setDates((prev) => ({ ...prev, warnDate: date }))
            }
            onRemove={() => {}}
          />
        </View>

        <View style={styles.infoBox}>
          <ThemedText style={styles.infoText}>
            This will add a new batch of{" "}
            <ThemedText type="defaultSemiBold">{quantity}</ThemedText> units to
            your current stock.
          </ThemedText>
        </View>
      </ScrollView>

      {/* Footer is now part of the flex column, sitting at the bottom */}
      <View style={[styles.footer, { backgroundColor: sheetBg }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.primaryButton, { backgroundColor: primaryBtnActive }]}
          onPress={handleSave}
        >
          <ThemedText style={styles.buttonText}>Confirm & Add Stock</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductRestockSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 1,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  infoText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  primaryButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
  },
});
