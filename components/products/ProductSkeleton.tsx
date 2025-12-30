// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import SkeletonBox from "../ui/SkeletonBox";

const ProductCardSkeleton = () => {
  const cardBg = useThemeColor({}, "sheet");
  const shadow = useThemeColor({}, "text");

  return (
    <View style={[styles.card, { backgroundColor: cardBg, shadowColor: shadow }]}>
      {/* Image skeleton */}
      <SkeletonBox
        height={125}
        borderRadius={0}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <SkeletonBox width="70%" height={14} borderRadius={6} />
          <SkeletonBox width={18} height={18} borderRadius={8} />
        </View>

        {/* Sub text */}
        <SkeletonBox
          width="40%"
          height={11}
          borderRadius={6}
          style={{ marginTop: 6 }}
        />

        {/* Stock row */}
        <View style={styles.stockRow}>
          <SkeletonBox width={28} height={15} borderRadius={6} />
          <SkeletonBox width={50} height={10} borderRadius={6} />
        </View>
      </View>
    </View>
  );
};

export default ProductCardSkeleton;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    margin: 5,
    overflow: "hidden",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    opacity: 0.35,
  },
  content: {
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 8,
  },
});
