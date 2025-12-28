// Leqa © 2025 Mithula Chanthuka

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useStock } from '@/contexts/StockContext'; 
import { useSQLiteContext } from 'expo-sqlite';
import { stockController } from '@/db/stockController';

export default function InventoryTestScreen() {
  const db = useSQLiteContext();
  const controller = stockController(db);
  const { products, refreshProducts, loading } = useStock();

  const handleAddDummyProduct = async () => {
    await controller.createProduct("calssic 550g", "Fresh white mushrooms", "550g", 9);
    await refreshProducts();
  };

  const handleAddBatch = async (productId: number) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    await controller.addStockBatch(productId, 5, expiry.toISOString());
    await refreshProducts();
  };

  const handleReduceStock = async (productId: number) => {
    const success = await controller.reduceStock(productId, 1);
    if (!success) Alert.alert("Out of Stock", "No batches available to reduce.");
    await refreshProducts();
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert("Delete Product", "This will remove the product and all its batches. Continue?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          await controller.deleteProduct(productId);
          await refreshProducts();
        } 
      }
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leqa Inventory Test</Text>
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No products yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.stock}>Stock: {item.total_stock} pkts</Text>
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => handleAddBatch(item.id)} style={[styles.btn, styles.addBtn]}>
                <Text style={styles.btnText}>+5</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleReduceStock(item.id)} style={[styles.btn, styles.reduceBtn]}>
                <Text style={styles.btnText}>-1</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={[styles.btn, styles.deleteBtn]}>
                <Text style={styles.btnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddDummyProduct}>
        <Text style={styles.fabText}>+ Add Blueprint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#333' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  itemCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  stock: { color: '#28a745', fontWeight: '600' },
  buttonGroup: { flexDirection: 'row', gap: 8 },
  btn: { padding: 10, borderRadius: 8, minWidth: 40, alignItems: 'center' },
  addBtn: { backgroundColor: '#e7f3ef' },
  reduceBtn: { backgroundColor: '#fff3cd' },
  deleteBtn: { backgroundColor: '#f8d7da' },
  btnText: { fontWeight: 'bold' },
  fab: { backgroundColor: '#007bff', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  fabText: { color: '#fff', fontWeight: 'bold' }
});