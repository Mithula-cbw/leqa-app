// Leqa © 2025 Mithula Chanthuka

import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { NoCustomersFound } from "@/components/shared";
import { CustomerCard } from "@/components/products";

const CustomersContent = () => {
  const { controller } = useStock();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await controller.getAllCustomers();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NoCustomersFound />
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={customers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CustomerCard item={item} />}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      // Add a pull-to-refresh option
      onRefresh={fetchCustomers}
      refreshing={loading}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 10,
    paddingBottom: 150,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
});

export default CustomersContent;
