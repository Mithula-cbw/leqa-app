// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/stock";
import { useStock } from "@/contexts/StockContext";
import { useSQLiteContext } from "expo-sqlite";
import { stockController } from "@/db/stockController";

const ProductCard = ({ item }: { item: Product }) => {
  const db = useSQLiteContext();
  const controller = stockController(db);
  const { refreshProducts } = useStock();
  const cardBg = useThemeColor({}, "background");
  const bgSecondary = useThemeColor({}, "background-seconary");

  const handleIncrease = async () => {
    const expiry = new Date();
    // Fallback to 7 days if default_shelf_life is null/undefined
    const daysToAdd = item.default_shelf_life ?? 7; 
    expiry.setDate(expiry.getDate() + daysToAdd);
    
    await controller.addStockBatch(item.id, 1, expiry.toISOString());
    await refreshProducts();
  };

  const handleDecrease = async () => {
    if (item.total_stock <= 0) return;
    await controller.reduceStock(item.id, 1);
    await refreshProducts();
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Change to your preferred currency
  }).format(item.price || 0);

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.leftSection}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: bgSecondary }]}>
            <ThemedText style={styles.placeholderText}>{item.title[0].toUpperCase()}</ThemedText>
          </View>
        )}

        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {item.title}
          </ThemedText>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.subText}>{item.weight}</ThemedText>
            <ThemedText style={styles.dot}> • </ThemedText>
            <ThemedText style={styles.priceText}>{formattedPrice}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={[styles.controls, { backgroundColor: bgSecondary }]}>
          <TouchableOpacity 
            onPress={handleDecrease} 
            style={[styles.btn, item.total_stock <= 0 && { opacity: 0.3 }]}
            disabled={item.total_stock <= 0}
          >
            <ThemedText style={styles.btnText}>-</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.stockCount}>
            <ThemedText 
                type="defaultSemiBold" 
                style={{ color: item.total_stock === 0 ? '#ff4444' : undefined }}
            >
                {item.total_stock}
            </ThemedText>
          </View>

          <TouchableOpacity onPress={handleIncrease} style={styles.btn}>
            <ThemedText style={styles.btnText}>+</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leftSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  thumbnail: { width: 50, height: 50, borderRadius: 15, marginRight: 12 },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { opacity: 0.4, fontSize: 18, fontWeight: "bold" },
  info: { flex: 1 },
  detailsRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  subText: { fontSize: 12, opacity: 0.5 },
  priceText: { fontSize: 12, fontWeight: "bold", color: "#28a745" },
  dot: { marginHorizontal: 4, opacity: 0.3 },
  rightSection: { alignItems: "flex-end" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 4,
  },
  stockCount: {
    paddingHorizontal: 8,
    minWidth: 28,
    alignItems: "center",
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#fff", // Keep buttons white for contrast against secondary bg
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  btnText: { fontSize: 18, fontWeight: "600" },
});