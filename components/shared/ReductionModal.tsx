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
import { ReduceMode } from "../home/ProductCard";

type ReductionType = "sell" | "waste" | "delete";
type IoniconName = keyof typeof Ionicons.glyphMap;

interface ReductionOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (type: ReductionType) => void;
  reduceMode: ReduceMode;
}

const ReductionOptionsModal: React.FC<ReductionOptionsModalProps> = ({
  isVisible,
  onClose,
  product,
  onConfirm,
  reduceMode,
}) => {
  const divider = useThemeColor({}, "background-seconary");
  const iconMuted = useThemeColor({}, "icon");

  const isAll = reduceMode === "all";

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
              <ThemedText style={styles.subtitle}>Reduce stock</ThemedText>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={iconMuted} />
            </TouchableOpacity>
          </View>

          {isAll && (
            <View style={styles.warningBox}>
              <Ionicons
                name="warning-outline"
                size={40}
                color="#f1cd29de"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={styles.warningText}>
                This will remove all stock for this product.
              </ThemedText>
            </View>
          )}

          {/* Options */}
          <Option
            icon="cash-outline"
            label={isAll ? `Sold items [${product.total_stock}]` : "Sold item"}
            type="sell"
            color="#269141ff"
            disabled={product.total_stock <= 0}
          />

          <Option
            icon="trash-bin-outline"
            label={isAll ? `Waste / expired [${product.total_stock}]` : "Waste / expired"}
            type="waste"
            color="#bf7e23ff"
            disabled={product.total_stock <= 0}
          />

          <Option
            icon="remove-circle-outline"
            label={isAll ? `Silent remove (no log) [${product.total_stock}]` : "Silent remove (no log)"}
            type="delete"
            color={iconMuted}
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

  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#f1cd29de",
    backgroundColor: "rgba(168, 156, 25, 0.14)",
    padding: 10,
    marginBottom: 10,
  },

  warningText: {
    fontSize: 12,
    color: "#998e8dff",
    flex: 1,
    lineHeight:16
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
