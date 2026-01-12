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
import { ReduceMode } from "../home/ProductCard";
import { Product } from "@/types/stock";
import { ReductionReason } from "@/types/customer";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ReductionOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (type: ReductionReason) => void; // Updated to ReductionReason
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
  const totalStock = Number(product.total_stock || 0);

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
    type: ReductionReason; // Updated to ReductionReason
    color?: string;
    isLast?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || totalStock <= 0}
      style={[
        styles.option,
        (disabled || totalStock <= 0) && { opacity: 0.4 },
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
                size={32}
                color="#f1cd29de"
                style={{ marginRight: 12 }}
              />
              <ThemedText style={styles.warningText}>
                This will remove all stock ({totalStock} units) for this
                product.
              </ThemedText>
            </View>
          )}

          {/* Options */}
          <Option
            icon="cash-outline"
            label={isAll ? `Sold all items [${totalStock}]` : "Sold item"}
            type="sale"
            color="#269141ff"
          />

          <Option
            icon="alert-circle-outline"
            label={isAll ? `Expired [${totalStock}]` : "Mark as Expired"}
            type="expired"
            color="#d32f2fff"
          />

          <Option
            icon="trash-bin-outline"
            label={isAll ? `General Waste [${totalStock}]` : "Mark as Waste"}
            type="waste"
            color="#bf7e23ff"
          />

          <Option
            icon="remove-circle-outline"
            label={
              isAll ? `Silent remove [${totalStock}]` : "Silent remove (no log)"
            }
            type="silent"
            color={iconMuted}
            isLast
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  content: {
    width: "100%",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#f1cd29de",
    backgroundColor: "rgba(241, 205, 41, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    lineHeight: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionIcon: {
    width: 24,
    marginRight: 14,
    textAlign: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
