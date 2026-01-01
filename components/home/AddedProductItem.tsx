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
  warnDate: Date | null;
  onUpdateWarn: (date: Date | null) => void;
  onUpdateExpiry: (date: Date | null) => void;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}

const AddedProductItem = ({
  product,
  quantity,
  expiryDate,
  warnDate,
  onUpdateWarn,
  onUpdateQty,
  onUpdateExpiry,
  onRemove,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);
  const [warnUnit, setWarnUnit] = useState<"days" | "hours">("days");

  const hasExpiry = expiryDate instanceof Date;
  const hasWarn = warnDate instanceof Date;

  const borderColor = useThemeColor({}, "background-muted");
  const iconColor = useThemeColor({}, "text");
  const accentColor = "#007AFF";

  const handleQtyInput = (value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    const num = clean === "" ? 0 : parseInt(clean, 10);
    onUpdateQty(num);
  };

  const openPicker = (mode: "date" | "time") => {
    if (!hasExpiry) return;
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onPickerChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) onUpdateExpiry(selected);
  };

  const getWarnValue = () => {
    if (!hasExpiry || !hasWarn) return 0;

    const diff = expiryDate!.getTime() - warnDate!.getTime();

    return warnUnit === "days"
      ? Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
      : Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  };

  const updateWarnFromValue = (value: number) => {
    if (!hasExpiry) return;

    const d = new Date(expiryDate!);

    if (warnUnit === "days") d.setDate(d.getDate() - value);
    else d.setHours(d.getHours() - value);

    onUpdateWarn(d);
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      {/* MAIN ROW */}
      <View style={styles.mainRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {product.title}
          </ThemedText>
          <ThemedText style={styles.subText}>
            {product.weight_value} {product.weight_unit ?? "g"}
          </ThemedText>
        </View>

        {/* QTY */}
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
            onBlur={() => !quantity && onUpdateQty(1)}
          />

          <TouchableOpacity
            onPress={() => onUpdateQty(quantity + 1)}
            style={styles.stepperBtn}
          >
            <Ionicons name="add" size={14} color={iconColor} />
          </TouchableOpacity>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={!hasExpiry}
            onPress={() => setIsExpanded((v) => !v)}
            style={[
              styles.iconBtn,
              isExpanded && styles.activeIconBtn,
              !hasExpiry && { opacity: 0.3 },
            ]}
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

      {/* EXPANDED */}
      {isExpanded && hasExpiry && (
        <>
          <View style={styles.accordionContent}>
            <ThemedText style={styles.label}>Expiry</ThemedText>

            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={[styles.selectorPill, { borderColor }]}
                onPress={() => openPicker("date")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={accentColor}
                />
                <ThemedText>{expiryDate!.toLocaleDateString()}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectorPill, { borderColor }]}
                onPress={() => openPicker("time")}
              >
                <Ionicons name="time-outline" size={16} color={accentColor} />
                <ThemedText>
                  {expiryDate!.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={expiryDate!}
                mode={pickerMode}
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onPickerChange}
              />
            )}
          </View>

          {hasWarn && (
            <>
              <ThemedText style={styles.label}>Warn Before</ThemedText>

              <View style={styles.pickerRow}>
                <TextInput
                  style={[styles.qtyInput]}
                  keyboardType="number-pad"
                  value={String(getWarnValue())}
                  onChangeText={(v) => updateWarnFromValue(parseInt(v) || 0)}
                />

                {(["days", "hours"] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setWarnUnit(unit)}
                    style={[
                      styles.unitBtn,
                      warnUnit === unit && styles.activeUnit,
                    ]}
                  >
                    <ThemedText
                      style={warnUnit === unit && styles.activeUnitText}
                    >
                      {unit}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </>
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
  unitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  activeUnit: { backgroundColor: "#007AFF" },
  unitText: { fontSize: 12, textTransform: "capitalize" },
  activeUnitText: { color: "#FFF", fontWeight: "bold" },

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
    backgroundColor: "rgba(150,150,150,0.05)",
    borderRadius: 12,
  },
  doneBtn: {
    alignItems: "center",
    paddingBottom: 10,
  },
});
