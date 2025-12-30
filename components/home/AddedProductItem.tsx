// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/shared";
import { Product } from "@/types/stock";

interface Props {
  product: Product;
  quantity: number;
  expiryDate: Date | null;
  onUpdateQty: (qty: number) => void;
  onUpdateExpiry: (date: Date) => void;
  onRemove: () => void;
}

const AddedProductItem = ({
  product,
  quantity,
  expiryDate,
  onUpdateQty,
  onUpdateExpiry,
  onRemove,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleQtyInput = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num)) onUpdateQty(num);
  };

  return (
    <View style={styles.container}>
      {/* MAIN ROW */}
      <View style={styles.mainRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold">{product.title}</ThemedText>
          <ThemedText style={styles.subText}>{product.weight}</ThemedText>
        </View>

        {/* Quantity */}
        <View style={styles.qtyControls}>
          <TouchableOpacity
            onPress={() => onUpdateQty(Math.max(1, quantity - 1))}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={16} />
          </TouchableOpacity>

          <TextInput
            style={styles.qtyInput}
            keyboardType="number-pad"
            value={String(quantity)}
            onChangeText={handleQtyInput}
          />

          <TouchableOpacity
            onPress={() => onUpdateQty(quantity + 1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="add" size={16} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.expandBtn}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "calendar-outline"}
            size={20}
            color="#007AFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* EXPANDED */}
      {isExpanded && (
        <View style={styles.accordionContent}>
          <ThemedText style={styles.label}>Expiry date</ThemedText>

          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} />
            <ThemedText style={styles.dateText}>
              {expiryDate ? expiryDate.toDateString() : "Select expiry date"}
            </ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) onUpdateExpiry(date);
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default AddedProductItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subText: {
    fontSize: 12,
    opacity: 0.6,
  },

  /* Quantity */
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyInput: {
    minWidth: 48,
    textAlign: "center",
    fontWeight: "700",
    paddingVertical: 4,
  },

  expandBtn: {
    padding: 8,
  },

  /* Accordion */
  accordionContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    opacity: 0.7,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateText: {
    fontSize: 14,
  },
});
