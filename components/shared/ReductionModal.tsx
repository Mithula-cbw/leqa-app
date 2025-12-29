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
import { Ionicons } from "@expo/vector-icons";
import { formatText } from "@/utils/formatText";
import { Product } from "@/types/stock";

type ReductionType = "sell" | "waste" | "delete";
type IoniconName = keyof typeof Ionicons.glyphMap;

interface ReductionOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (type: ReductionType) => void;
}

const ReductionOptionsModal: React.FC<ReductionOptionsModalProps> = ({
  isVisible,
  onClose,
  product,
  onConfirm,
}) => {
  const divider = useThemeColor({}, "background-seconary");
  const iconMuted = useThemeColor({}, "icon");

  const Option = ({
    icon,
    label,
    type,
    color,
    isLast,
     disabled = false,
  }: {
    icon: IoniconName;
    label: string;
    type: ReductionType;
    color?: string;
    isLast?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.option,
        !isLast && {
          borderBottomColor: divider,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
      onPress={() => {
        onConfirm(type);
        onClose();
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={color || iconMuted}
        style={styles.optionIcon}
      />
      <ThemedText style={[styles.optionText, color && { color }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.title}
                numberOfLines={1}
              >
                {formatText(product.title)}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Reduce stock
              </ThemedText>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={iconMuted} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <Option
            icon="cash-outline"
            label="Sold item"
            type="sell"
            color="#269141ff" // Consistent Emerald Green
            disabled={product.total_stock <= 0}
          />
          
          <Option
            icon="trash-bin-outline"
            label="Waste / expired"
            type="waste"
            color="#bf7e23ff" // Consistent Warning Amber
            disabled={product.total_stock <= 0}
          />
          
          <Option
            icon="remove-circle-outline"
            label="Silent remove (no log)"
            type="delete"
            color={iconMuted} // Uses your theme's muted icon color (Slate/Gray)
            isLast
            disabled={product.total_stock <= 0}
          />
        </ThemedView>
      </Pressable>
    </Modal>
  );
};

export default ReductionOptionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 45,
  },

  content: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  title: {
    fontSize: 17,
  },

  subtitle: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  optionIcon: {
    width: 22,
    marginRight: 14,
    textAlign: "center",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
