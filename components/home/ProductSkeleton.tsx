import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import SkeletonBox from "../ui/SkeletonBox";

const ProductSkeleton = () => {
  const cardBg = useThemeColor({}, "sheet");

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* Image */}
      <SkeletonBox width={100} height={100} borderRadius={12} />

      {/* Content */}
      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.text}>
            <SkeletonBox width="70%" height={14} borderRadius={4} />
            <SkeletonBox
              width="45%"
              height={10}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>

          {/* Chevron hint */}
          <SkeletonBox width={18} height={18} borderRadius={9} />
        </View>

        {/* Controls hint */}
        <View style={styles.controlBox}>
          <SkeletonBox width={90} height={32} borderRadius={14} />
        </View>
      </View>
    </View>
  );
};

export default ProductSkeleton;

const styles = StyleSheet.create({
  card: {
    height: 120,
    flexDirection: "row",
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
    opacity: 0.35,
  },

  content: {
    flex: 1,
    height: "100%",
    marginLeft: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  controlBox: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  text: {
    flex: 1,
    paddingRight: 10,
  },
});
