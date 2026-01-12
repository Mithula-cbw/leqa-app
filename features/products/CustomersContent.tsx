// Leqa © 2025 Mithula Chanthuka

import React, { useState, useMemo } from "react";
import { FlatList, View, StyleSheet, TextInput } from "react-native";
import { useStock } from "@/contexts/StockContext";
import { NoCustomersFound } from "@/components/shared";
import { CustomerCard, CustomerSkeleton } from "@/components/products";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

const CustomersContent = () => {
  const { customers, loading } = useStock();
  const [searchQuery, setSearchQuery] = useState("");

  const bgSecondary = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const iconMuted = useThemeColor({}, "icon");

  // Fuzzy-ish search logic
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(query);
      const phoneMatch = c.phone?.toLowerCase().includes(query);
      const emailMatch = c.email?.toLowerCase().includes(query);
      return nameMatch || phoneMatch || emailMatch;
    });
  }, [searchQuery, customers]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NoCustomersFound />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: bgSecondary }]}>
          <Ionicons
            name="search"
            size={18}
            color={iconMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search name, phone or email..."
            placeholderTextColor={iconMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: textColor }]}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={iconMuted}
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5].map((key) => (
            <CustomerSkeleton key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CustomerCard item={item} />}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingTop: 5,
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
