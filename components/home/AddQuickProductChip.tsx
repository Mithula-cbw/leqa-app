import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/shared";
import { Product } from "@/types/stock";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

interface AddQuickProductChipProps {
  product: Product;
  onPress: (product: Product) => void;
}

const AddQuickProductChip = ({
  product,
  onPress,
}: AddQuickProductChipProps) => {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const primaryBtn = useThemeColor({}, "background-muted");
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: bgSecondary }]}
      onPress={() => onPress(product)}
    >
      {/* Product Image or Placeholder */}
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.quickThumb} />
      ) : (
        <View
          style={[styles.quickPlaceholder, { backgroundColor: primaryBtn }]}
        >
          <ThemedText style={styles.placeholderChar}>
            {product.title[0].toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.quickInfo}>
        <ThemedText
          type="defaultSemiBold"
          numberOfLines={1}
          style={styles.titleText}
        >
          {product.title}
        </ThemedText>

        <View style={styles.detailsRow}>
          <ThemedText style={styles.quickSubText}>{product.weight}</ThemedText>
          <ThemedText style={styles.quickSubText}> • </ThemedText>
          <ThemedText
            style={[
              styles.quickSubText,
              { color: "#28a745", fontWeight: "700" },
            ]}
          >
            {product.total_stock}
          </ThemedText>
        </View>
      </View>

      <View style={styles.quickAddIcon}>
        <Ionicons name="add" size={16} color={textColor} />
      </View>
    </TouchableOpacity>
  );
};

export default AddQuickProductChip;

const styles = StyleSheet.create({
  quickCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 16,
    width: 180,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  quickThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  quickPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderChar: {
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.5,
  },
  quickInfo: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 13,
    lineHeight: 16,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickSubText: {
    fontSize: 11,
    opacity: 0.6,
  },
  quickAddIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});
