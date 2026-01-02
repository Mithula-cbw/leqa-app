// Leqa © 2026 Mithula Chanthuka
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/shared";
import BottomSheet from "@/components/ui/BottomSheet";

// Types
export type AnalyticsSection = "general" | "products" | "customers";

interface TabButtonProps {
  label: string; // The text to display
  isActive: boolean; // Current selection state
  onPress: () => void; // Function to trigger on click
  activeColor: string; // Theme-aware primary color
}

/**
 * Sub-component for individual tab items to keep the main render clean.
 */
const TabButton = ({
  label,
  isActive,
  onPress,
  activeColor,
}: TabButtonProps) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && { backgroundColor: activeColor }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <ThemedText style={[styles.tabText, isActive && styles.tabTextActive]}>
      {label}
    </ThemedText>
  </TouchableOpacity>
);

export default function AnalyticsScreen() {
  // State
  const [activeTab, setActiveTab] = useState<AnalyticsSection>("general");
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);

  // Theme & Constants
  const primaryColor = "#487d55"; // Your brand green
  const surfaceColor = useThemeColor({}, "background");

  // Event Handlers
  const handleTabPress = (section: AnalyticsSection) => {
    setActiveTab(section);
  };

  const handleOpenSheet = () => {
    setSheetVisible(true);
  };

  const handleCloseSheet = () => {
    setSheetVisible(false);
  };

  // Helper to render the correct component based on state
  const renderSectionContent = () => {
    switch (activeTab) {
      case "general":
        return <ThemedText>General Analytics Content</ThemedText>;
      case "products":
        return <ThemedText>Product Performance Content</ThemedText>;
      case "customers":
        return <ThemedText>Customer Insights Content</ThemedText>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: surfaceColor }]}>
      {/* Header & Navigation */}
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Financial Analytics
        </ThemedText>

        <View style={styles.tabBar}>
          <TabButton
            label="General"
            isActive={activeTab === "general"}
            onPress={() => handleTabPress("general")}
            activeColor={primaryColor}
          />
          <TabButton
            label="Products"
            isActive={activeTab === "products"}
            onPress={() => handleTabPress("products")}
            activeColor={primaryColor}
          />
          <TabButton
            label="Customers"
            isActive={activeTab === "customers"}
            onPress={() => handleTabPress("customers")}
            activeColor={primaryColor}
          />
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSectionContent()}
      </ScrollView>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={handleOpenSheet}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Transaction Bottom Sheet */}
      <BottomSheet
        sheetTitle="Add Transaction"
        visible={sheetVisible}
        onClose={handleCloseSheet}
      >
        <View style={styles.sheetContent}>
          {/* Your TransactionAddSheet component will go here */}
          <ThemedText>Form Placeholder</ThemedText>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  title: {
    marginBottom: 15,
  },
  tabBar: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  tabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for FAB
  },
  sheetContent: {
    padding: 20,
    minHeight: 200,
  },
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
