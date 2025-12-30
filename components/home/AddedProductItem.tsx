// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/shared";
import { Product } from "@/types/stock";
import { useThemeColor } from "@/hooks/use-theme-color";

interface Props {
  product: Product;
  quantity: number;
  expiryDate: Date | null;
  onUpdateQty: (qty: number) => void;
  onUpdateExpiry: (date: Date) => void;
  onRemove: () => void;
}

const AddedProductItem = ({
  product,
  quantity,
  expiryDate,
  onUpdateQty,
  onUpdateExpiry,
  onRemove,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  const borderColor = useThemeColor({}, "background-muted");
  const iconColor = useThemeColor({}, "text");
  const accentColor = "#007AFF";

  const handleQtyInput = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const num = cleanValue === "" ? 0 : parseInt(cleanValue, 10);
    onUpdateQty(num);
  };

  const openPicker = (mode: "date" | "time") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onPickerChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      onUpdateExpiry(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.mainRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {product.title}
          </ThemedText>
          <ThemedText style={styles.subText}>{product.weight}</ThemedText>
        </View>

        {/* Quantity Input */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            onPress={() => onUpdateQty(Math.max(1, quantity - 1))}
            style={styles.stepperBtn}
          >
            <Ionicons name="remove" size={14} color={iconColor} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.qtyInput, { color: iconColor }]}
            keyboardType="number-pad"
            value={String(quantity)}
            onChangeText={handleQtyInput}
            onBlur={() => { if(!quantity) onUpdateQty(1); }}
          />

          <TouchableOpacity
            onPress={() => onUpdateQty(quantity + 1)}
            style={styles.stepperBtn}
          >
            <Ionicons name="add" size={14} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={[styles.iconBtn, isExpanded && styles.activeIconBtn]}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={isExpanded ? accentColor : iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onRemove} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* EXPANDED SECTION */}
      {isExpanded && (
        <View style={styles.accordionContent}>
          <ThemedText style={styles.label}>Expiry Date & Time</ThemedText>
          
          <View style={styles.pickerRow}>
            {/* Date Picker Trigger */}
            <TouchableOpacity
              style={[styles.selectorPill, { borderColor }]}
              onPress={() => openPicker("date")}
            >
              <Ionicons name="calendar-outline" size={16} color={accentColor} />
              <ThemedText style={styles.selectorText}>
                {expiryDate ? expiryDate.toLocaleDateString() : "Set Date"}
              </ThemedText>
            </TouchableOpacity>

            {/* Time Picker Trigger */}
            <TouchableOpacity
              style={[styles.selectorPill, { borderColor }]}
              onPress={() => openPicker("time")}
            >
              <Ionicons name="stopwatch-outline" size={16} color={accentColor} />
              <ThemedText style={styles.selectorText}>
                {expiryDate 
                  ? expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Set Time"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : null}>
               <DateTimePicker
                value={expiryDate ?? new Date()}
                mode={pickerMode}
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onPickerChange}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  onPress={() => setShowPicker(false)} 
                  style={styles.doneBtn}
                >
                  <ThemedText style={{color: accentColor, fontWeight: '600'}}>Done</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AddedProductItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    borderRadius: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.1)",
  },
  stepperBtn: {
    padding: 8,
  },
  qtyInput: {
    width: 30,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },
  activeIconBtn: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  accordionContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.3)",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.5,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectorPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "rgba(150, 150, 150, 0.05)",
  },
  selectorText: {
    fontSize: 13,
    fontWeight: "500",
  },
  iosPickerContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(150,150,150,0.05)',
    borderRadius: 12,
  },
  doneBtn: {
    alignItems: 'center',
    paddingBottom: 10,
  }
});