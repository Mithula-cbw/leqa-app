// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { StockItem } from "@/types/stock";

interface Props {
  title: string; // e.g., "Batch 1"
  items: StockItem[];
  onDelete: (batchId: number) => void;
}

const BatchAccordion = ({ title, items, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#555"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {items.map((item) => {
            const isExpired = item.expiry_at && new Date(item.expiry_at) < new Date();
            return (
              <View key={item.id} style={styles.batchCard}>
                <View style={{ flex: 1 }}>
                  <ThemedText>Qty: {item.quantity}</ThemedText>
                  {item.expiry_at && (
                    <ThemedText style={{ color: isExpired ? "#ff4444" : "#19a139" }}>
                      Exp: {new Date(item.expiry_at).toLocaleDateString()}
                    </ThemedText>
                  )}
                </View>
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ff4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default BatchAccordion;

const styles = StyleSheet.create({
  container: { marginVertical: 8, borderRadius: 12, overflow: "hidden" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
  },
  content: { padding: 8 },
  batchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
});
