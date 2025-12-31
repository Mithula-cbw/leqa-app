import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

interface WheelPickerProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  range: number;
  suffix?: string;
  width?: number;
}

export const WheelPicker = ({
  label,
  value,
  onValueChange,
  range,
  suffix,
  width = 72,
}: WheelPickerProps) => {
  const bg = useThemeColor({}, "sheet");
  const text = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { width }]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View style={[styles.wrapper, { backgroundColor: bg }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={[styles.item, { color: text }]}
        >
          {Array.from({ length: range + 1 }, (_, i) => (
            <Picker.Item
              key={i}
              label={`${i}${suffix ? ` ${suffix}` : ""}`}
              value={i}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
    fontWeight: "600",
  },
  wrapper: {
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    ...Platform.select({
      ios: {
        height: 110,
        marginTop: -34, // 🔑 visual wheel without layout growth
      },
      android: {
        height: 40,
      },
    }),
  },
  item: {
    fontSize: 15,
    fontWeight: "600",
  },
});
