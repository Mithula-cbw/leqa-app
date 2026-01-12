import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

interface QuickCustomerChipProps {
  customer: any;
  isSelected: boolean;
  onPress: (id: number) => void;
}

const QuickCustomerChip = ({
  customer,
  isSelected,
  onPress,
}: QuickCustomerChipProps) => {
  const bgSecondary = useThemeColor({}, "background-seconary");
  const primaryBtn = useThemeColor({}, "background-muted");
  const activeColor = "#487d55";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: bgSecondary,
          borderColor: isSelected ? activeColor : "rgba(0,0,0,0.03)",
        },
      ]}
      onPress={() => onPress(customer.id)}
    >
      {customer.image ? (
        <Image source={{ uri: customer.image }} style={styles.thumb} />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: primaryBtn }]}>
          <ThemedText style={styles.placeholderChar}>
            {customer.name[0].toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.info}>
        <ThemedText
          type="defaultSemiBold"
          numberOfLines={1}
          style={styles.titleText}
        >
          {customer.name}
        </ThemedText>
        <ThemedText style={styles.subText}>
          {customer.phone || "No phone"}
        </ThemedText>
      </View>

      {isSelected && (
        <View style={[styles.checkIcon, { backgroundColor: activeColor }]}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default QuickCustomerChip;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 16,
    width: 160,
    gap: 10,
    borderWidth: 2,
  },
  thumb: { width: 40, height: 40, borderRadius: 10 },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderChar: { fontSize: 16, fontWeight: "bold", opacity: 0.5 },
  info: { flex: 1 },
  titleText: { fontSize: 13 },
  subText: { fontSize: 11, opacity: 0.6 },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
});
