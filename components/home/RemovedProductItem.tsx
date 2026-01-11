import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { Product } from "@/types/stock";
import { useThemeColor } from "@/hooks/use-theme-color";

interface Props {
  product: Product;
  quantity: number;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}

const RemovedProductItem = ({
  product,
  quantity,
  onUpdateQty,
  onRemove,
}: Props) => {
  const borderColor = useThemeColor({}, "background-muted");
  const iconColor = useThemeColor({}, "text");

  const handleQtyInput = (value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    const num = clean === "" ? 0 : parseInt(clean, 10);

    // Ensure we don't exceed what's actually in stock
    const max = product.total_stock ?? 0;
    onUpdateQty(Math.min(num, max));
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.mainRow}>
        {/* PRODUCT INFO */}
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {product.title}
          </ThemedText>
          <ThemedText style={styles.subText}>
            Stock: {product.total_stock} | {product.weight_value}{" "}
            {product.weight_unit ?? "g"}
          </ThemedText>
        </View>

        {/* QTY CONTROLS */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            onPress={() => onUpdateQty(Math.max(1, quantity - 1))}
            style={styles.stepperBtn}
          >
            <Ionicons name="remove" size={16} color={iconColor} />
          </TouchableOpacity>

          <TextInput
            style={[styles.qtyInput, { color: iconColor }]}
            keyboardType="number-pad"
            value={String(quantity)}
            onChangeText={handleQtyInput}
            onBlur={() => !quantity && onUpdateQty(1)}
          />

          <TouchableOpacity
            onPress={() => {
              const max = product.total_stock ?? 0;
              if (quantity < max) onUpdateQty(quantity + 1);
            }}
            style={styles.stepperBtn}
          >
            <Ionicons name="add" size={16} color={iconColor} />
          </TouchableOpacity>
        </View>

        {/* REMOVE FROM LIST */}
        <TouchableOpacity onPress={onRemove} style={styles.trashBtn}>
          <Ionicons name="close-circle-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RemovedProductItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "rgba(150, 150, 150, 0.02)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(150, 150, 150, 0.08)",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  stepperBtn: {
    padding: 6,
    paddingHorizontal: 10,
  },
  qtyInput: {
    width: 35,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
  trashBtn: {
    padding: 4,
  },
});
