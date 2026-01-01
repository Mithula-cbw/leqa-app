import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { StockItem } from "@/types/stock";
import { useThemeColor } from "@/hooks/use-theme-color";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  title: string;
  items: StockItem[];
  onDelete: (batchId: number) => void;
}

const BatchAccordion = ({ title, items, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const bgSecondary = useThemeColor({}, "background-seconary");
  const borderColor = useThemeColor({}, "icon");

  const summaryStatus = useMemo(() => {
    const now = new Date();
    let hasExpired = false;
    let hasWarning = false;

    items.forEach((item) => {
      const expiry = item.expiry_at && new Date(item.expiry_at);
      const warn = item.warn_at && new Date(item.warn_at);

      if (expiry && expiry < now) hasExpired = true;
      else if (warn && warn < now) hasWarning = true;
    });

    if (hasExpired)
      return { color: "#ef4444", label: "Expired", icon: "alert-circle" };
    if (hasWarning)
      return {
        color: "#f59e0b",
        label: "Warning",
        icon: "alert-circle-outline",
      };
    return { color: "#10b981", label: "Good", icon: "check-circle-outline" };
  }, [items]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgSecondary,
          borderLeftWidth: 4,
          borderLeftColor: summaryStatus.color,
        },
      ]}
    >
      {/* HEADER */}
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={summaryStatus.icon as any}
            size={18}
            color={summaryStatus.color}
            style={{ marginRight: 10 }}
          />
          <View>
            <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
              {title}
            </ThemedText>
            {!expanded && (
              <ThemedText
                style={[styles.headerSub, { color: summaryStatus.color }]}
              >
                {items.length} units • {summaryStatus.label}
              </ThemedText>
            )}
          </View>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={borderColor}
        />
      </TouchableOpacity>

      {/* EXPANDED CONTENT — SAME CARD */}
      {expanded && (
        <View style={styles.content}>
          {items.map((item) => {
            const now = new Date();
            const expiry = item.expiry_at && new Date(item.expiry_at);
            const warn = item.warn_at && new Date(item.warn_at);

            const isExpired = expiry && expiry < now;
            const isWarning = !isExpired && warn && warn < now;

            const statusColor = isExpired
              ? "#ef4444"
              : isWarning
              ? "#f59e0b"
              : "#10b962ff";

            return (
              <View key={item.id} style={styles.batchRow}>
                <View style={styles.cardMain}>
                  <View style={styles.row}>
                    <ThemedText style={styles.qtyLabel}>Quantity: </ThemedText>
                    <ThemedText style={styles.qtyValue}>
                      {item.quantity}
                    </ThemedText>
                  </View>

                  {expiry && (
                    <View style={styles.expiryRow}>
                      <Ionicons
                        name={isExpired ? "alert-circle" : "time-outline"}
                        size={14}
                        color={statusColor}
                      />
                      <ThemedText
                        style={[styles.expiryText, { color: statusColor }]}
                      >
                        {isExpired ? "Expired" : "Expires"}:{" "}
                        {expiry.toLocaleDateString()}
                      </ThemedText>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => onDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default BatchAccordion;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  batchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  badge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
    marginLeft: 8,
  },
  badgeText: { fontSize: 11, opacity: 0.6, fontWeight: "600" },
  content: { paddingTop: 0 },
  batchCard: {
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 18,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusIndicator: {
    width: 4,
    height: "60%",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardMain: { flex: 1, padding: 10, gap: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    alignItems: "center",
  },
  qtyLabel: { fontSize: 13, opacity: 0.5 },
  qtyValue: { fontSize: 16, fontWeight: "700" },
  expiryRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  expiryText: { fontSize: 12, fontWeight: "600" },
  deleteBtn: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.05)",
  },
});
