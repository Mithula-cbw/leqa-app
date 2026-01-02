// Leqa © 2026 Mithula Chanthuka

import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/shared";
import BottomSheet from "@/components/ui/BottomSheet";
// import { TransactionAddSheet } from "@/features/analytics";

export default function AnalyticsScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const primaryColor = "#487d55ff";
  const fabBg = useThemeColor({}, "background-muted");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="subtitle">Financial Analytics</ThemedText>
        {/* Your Analytics Charts/List will go here */}
      </View>

      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <BottomSheet
        sheetTitle="Add Transaction"
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      >
        <View></View>
        {/* <TransactionAddSheet onFinish={() => setSheetVisible(false)} /> */}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, marginTop: 45 },
  fab: {
    position: "absolute",
    bottom: 113,
    right: 18,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
