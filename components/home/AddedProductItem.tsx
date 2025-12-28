// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/shared";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types/stock";

interface Props {
  product: Product;
  quantity: number;
  expiryDate: string;
  onUpdateQty: (qty: number) => void;
  onUpdateExpiry: (date: string) => void;
  onRemove: () => void;
}

const AddedProductItem = ({ product, quantity, expiryDate, onUpdateQty, onUpdateExpiry, onRemove }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold">{product.title}</ThemedText>
          <ThemedText style={styles.subText}>{product.weight}</ThemedText>
        </View>

        <View style={styles.qtyControls}>
          <TouchableOpacity onPress={() => onUpdateQty(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
            <Ionicons name="remove" size={18} />
          </TouchableOpacity>
          <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
          <TouchableOpacity onPress={() => onUpdateQty(quantity + 1)} style={styles.qtyBtn}>
            <Ionicons name="add" size={18} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.expandBtn}>
          <Ionicons name={isExpanded ? "chevron-up" : "calendar-outline"} size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.accordionContent}>
          <ThemedText style={styles.label}>Expiry Date (YYYY-MM-DD):</ThemedText>
          <TextInput 
            style={styles.input}
            value={expiryDate}
            onChangeText={onUpdateExpiry}
            placeholder="2025-12-31"
          />
        </View>
      )}
    </View>
  );
};

export default AddedProductItem;

const styles = StyleSheet.create({
  container: { marginBottom: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)' },
  mainRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 8 },
  qtyBtn: { padding: 8 },
  qtyText: { paddingHorizontal: 8, fontWeight: 'bold' },
  subText: { fontSize: 12, opacity: 0.6 },
  expandBtn: { padding: 8 },
  accordionContent: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' }
});