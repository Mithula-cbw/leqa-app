// Leqa © 2026 Mithula Chanthuka
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/shared";
import BottomSheet from "@/components/ui/BottomSheet";
import { GeneralAnalyticsChart } from "@/components/analytics";
import { useTransactions } from "@/contexts/TransactionContext";
import TransactionForm from "@/features/analytics/TransactionForm";
import { CustomerImpactChart, StockImpactChart } from "@/features/analytics";
import { useStock } from "@/contexts/StockContext";

export type AnalyticsSection = "general" | "products" | "customers";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
}

const TabButton = ({
  label,
  isActive,
  onPress,
  activeColor,
}: TabButtonProps) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      isActive && { backgroundColor: activeColor, borderColor: activeColor },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <ThemedText style={[styles.tabText, isActive && styles.tabTextActive]}>
      {label}
    </ThemedText>
  </TouchableOpacity>
);

export default function AnalyticsScreen() {
  // Pulling controller and refresh function from context
  const { transactions, stockLogs, controller, refreshTransactions } =
    useTransactions();
  const { products, customers } = useStock();

  const [activeTab, setActiveTab] = useState<AnalyticsSection>("general");
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);

  const primaryColor = "#487d55";
  const surfaceColor = useThemeColor({}, "background");

  const handleTabPress = (section: AnalyticsSection) => {
    setActiveTab(section);
  };

  const handleOpenSheet = () => setSheetVisible(true);
  const handleCloseSheet = () => setSheetVisible(false);

  const handleSaveTransaction = async (data: any) => {
    try {
      await controller.createTransaction(
        data.type,
        data.amount,
        data.description,
        null,
        data.created_at
      );

      // Sync the UI with the new database record
      await refreshTransactions();
      handleCloseSheet();
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save transaction. Please try again.");
    }
  };

  const renderSectionContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralAnalyticsChart transactions={transactions} />;
      case "products":
        return (
          <StockImpactChart
            logs={stockLogs}
            transactions={transactions}
            products={products}
          />
        );
      case "customers":
        return (
          <CustomerImpactChart
            transactions={transactions}
            customers={customers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: surfaceColor }]}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Financial Analytics
        </ThemedText>

        <View style={styles.tabBar}>
          {(["general", "products", "customers"] as AnalyticsSection[]).map(
            (tab) => (
              <TabButton
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                isActive={activeTab === tab}
                onPress={() => handleTabPress(tab)}
                activeColor={primaryColor}
              />
            )
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSectionContent()}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={handleOpenSheet}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <BottomSheet
        sheetTitle="Add Transaction"
        visible={sheetVisible}
        onClose={handleCloseSheet}
      >
        <View style={styles.sheetContent}>
          <TransactionForm
            onSave={handleSaveTransaction}
            onClose={handleCloseSheet}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
  title: { marginBottom: 15 },
  tabBar: { flexDirection: "row", gap: 8 },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e020",
  },
  tabText: { fontSize: 14, fontWeight: "500", color: "#888" },
  tabTextActive: { color: "#fff" },
  content: { flex: 1 },
  scrollContent: { padding: 10, paddingBottom: 120 },
  sheetContent: { padding: 10, minHeight: 200 },
  placeholder: { textAlign: "center", marginTop: 40, opacity: 0.5 },
  fab: {
    position: "absolute",
    bottom: 113,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
