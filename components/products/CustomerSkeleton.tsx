// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import SkeletonBox from "../ui/SkeletonBox";

const CustomerCardSkeleton = () => {
  const cardBg = useThemeColor({}, "sheet");
  const shadow = useThemeColor({}, "text");

  return (
    <View
      style={[styles.card, { backgroundColor: cardBg, shadowColor: shadow }]}
    >
      <SkeletonBox height={125} borderRadius={0} />

      <View style={styles.content}>
        {/* Name Row */}
        <View style={styles.titleRow}>
          <SkeletonBox width="60%" height={14} borderRadius={6} />
          <SkeletonBox
            width={16}
            height={16}
            borderRadius={4}
            style={{ marginLeft: "auto" }}
          />
        </View>

        {/* Phone Row */}
        <View style={styles.infoRow}>
          <SkeletonBox width={12} height={12} borderRadius={4} />
          <SkeletonBox width="45%" height={11} borderRadius={4} />
        </View>

        {/* Email Row */}
        <View style={styles.infoRow}>
          <SkeletonBox width={12} height={12} borderRadius={4} />
          <SkeletonBox width="75%" height={11} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

export default CustomerCardSkeleton;

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
  content: { padding: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
});
