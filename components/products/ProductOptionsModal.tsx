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
import { ProductAction } from "./ProductCard";
import { Product } from "@/types/stock";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ProductOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  isPinned: boolean;
  onAction: (action: ProductAction) => void;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isVisible,
  onClose,
  product,
  isPinned,
  onAction,
}) => {
  const divider = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");
  const iconMuted = useThemeColor({}, "icon");

  const Option = ({
    icon,
    label,
    type,
    color,
    isLast,
  }: {
    icon: IoniconName;
    label: string;
    type: ProductAction;
    color?: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.option,
        !isLast && {
          borderBottomColor: divider,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
      onPress={() => {
        onAction(type);
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
              <ThemedText style={styles.subtitle}>Product actions</ThemedText>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={iconMuted} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <Option icon="eye-outline" label="View details" type="view" />
          <Option icon="create-outline" label="Edit product" type="edit" />
          <Option
            icon={isPinned ? "pin-outline" : "pin"}
            label={isPinned ? "Unpin" : "Pin to top"}
            type="pin"
          />
          <Option icon="refresh-outline" color="#ca9f13ff" label={`Empty stock (${product.total_stock} Left)`} type="empty" />
          <Option
            icon="trash-outline"
            label="Delete product"
            type="delete"
            color="#FF3B30"
            isLast
          />
        </ThemedView>
      </Pressable>
    </Modal>
  );
};

export default ProductOptionsModal;

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
