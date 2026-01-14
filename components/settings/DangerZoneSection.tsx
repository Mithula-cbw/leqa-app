// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "@/components/shared/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  onDeleteAll: () => void | Promise<void>;
};

const DangerZoneSection = ({ onDeleteAll }: Props) => {
  const textMuted = useThemeColor({}, "text-muted");
  const danger = "#910000"
  const border = useThemeColor({}, "background-seconary");

  const confirm = () => {
    Alert.alert(
      "Delete all data?",
      "This will remove your profile and app data from this device. This action can’t be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteAll(),
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Danger zone</ThemedText>
      <ThemedText style={[styles.sectionSub, { color: textMuted }]}>
        Reset everything. Use carefully.
      </ThemedText>

      <TouchableOpacity
        onPress={confirm}
        style={[styles.deleteBtn, { borderColor: border }]}
        activeOpacity={0.85}
      >
        <ThemedText style={[styles.deleteText, { color: danger }]}>
          Delete all user data
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default DangerZoneSection;

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSub: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 14,
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "800",
  },
});
