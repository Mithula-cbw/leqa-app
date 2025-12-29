// Leqa © 2025 Mithula Chanthuka

import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  View,
} from "react-native";
import { ThemedText, ThemedView } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

interface AlertDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isDestructive?: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  isDestructive = false,
}) => {
  const bgSecondary = useThemeColor({}, "background-seconary");

  const btnColr = useThemeColor({}, "background-muted")

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedView style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.description}>{description}</ThemedText>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: bgSecondary }]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isDestructive ? "#FF3B30" : btnColr },
              ]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <ThemedText style={[styles.buttonText, { color: "#FFF" }]}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Pressable>
    </Modal>
  );
};

export default AlertDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  content: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 20, marginBottom: 8, textAlign: "center" },
  description: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: { flexDirection: "row", gap: 10, width: "100%" },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { fontWeight: "600", fontSize: 15 },
});
