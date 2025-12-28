// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, TouchableOpacity, Modal, Pressable, View } from "react-native";
import { ThemedText, ThemedView } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ReductionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (type: 'sell' | 'waste' | 'delete') => void;
  productTitle: string;
}

const ReductionModal: React.FC<ReductionModalProps> = ({ 
  isVisible, 
  onClose, 
  onConfirm, 
  productTitle 
}) => {
  const borderColor = useThemeColor({}, "background-seconary");

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedView style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            Reduce Stock
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select a reason for {productTitle}:
          </ThemedText>

          <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]} onPress={() => onConfirm('sell')}>
            <ThemedText style={styles.emoji}>💰</ThemedText>
            <ThemedText style={styles.optionText}>Sold Item</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]} onPress={() => onConfirm('waste')}>
            <ThemedText style={styles.emoji}>🗑️</ThemedText>
            <ThemedText style={styles.optionText}>Waste / Expired</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]} onPress={() => onConfirm('delete')}>
            <ThemedText style={styles.emoji}>⚙️</ThemedText>
            <ThemedText style={styles.optionText}>Silent Remove (No Log)</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Pressable>
    </Modal>
  );
};

export default ReductionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  content: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, opacity: 0.6, textAlign: 'center', marginBottom: 24 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emoji: { fontSize: 22, marginRight: 16 },
  optionText: { fontSize: 17, fontWeight: '500' }
});