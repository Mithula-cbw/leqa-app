import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

interface WheelPickerProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  range: number;
  suffix?: string;
}

export const WheelPicker = ({
  label,
  value,
  onValueChange,
  range,
  suffix,
}: WheelPickerProps) => {
  const bg = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text-muted");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.pickerWrapper, { backgroundColor: bg }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={[styles.itemStyle, { color: textColor }]}
          mode={Platform.OS === "android" ? "dropdown" : "dialog"}
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
    flex: 1,
    marginVertical: 10,
  },
  label: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
    fontWeight: "600",
    marginLeft: 4,
  },
  pickerWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    height: Platform.OS === "ios" ? 160 : 48,
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 160 : 48,
  },
  itemStyle: {
    fontSize: 18,
    height: 160,
  },
});
