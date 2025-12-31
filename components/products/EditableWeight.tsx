import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

interface EditableWeightProps {
  value: number;
  unit: "g" | "kg";
  onSave: (newValue: number, newUnit: "g" | "kg") => void;
}

const EditableWeight = ({ value, unit, onSave }: EditableWeightProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));
  const [tempUnit, setTempUnit] = useState(unit);

  const iconColor = useThemeColor({}, "background");

  useEffect(() => {
    return () => {
      setIsEditing(false);
    };
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (isEditing) {
        setIsEditing(false);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [isEditing]);

  const handleSave = () => {
    onSave(parseFloat(tempValue) || 0, tempUnit);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <View style={styles.viewRow}>
        <ThemedText style={[styles.valueText, { color: "#fff" }]}>
          {value} {unit}
        </ThemedText>
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.editBtn}
        >
          <MaterialIcons name="mode-edit" size={18} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.editContainer}>
      <View style={[styles.inputRow]}>
        <TextInput
          style={styles.flexInput}
          keyboardType="numeric"
          autoFocus
          value={tempValue}
          onChangeText={setTempValue}
        />

        <View style={styles.unitToggleContainer}>
          {(["g", "kg"] as const).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => setTempUnit(u)}
              style={[
                styles.unitSmallBtn,
                tempUnit === u && { backgroundColor: "#79501ab9" },
              ]}
            >
              <ThemedText style={[styles.unitSmallText, { color: "#fff" }]}>
                {u}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity onPress={handleSave} style={styles.actionBtn}>
            <Ionicons name="checkmark-sharp" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            style={styles.actionBtn}
          >
            <Ionicons name="close-sharp" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditableWeight;

const styles = StyleSheet.create({
  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 0,
    gap: 8,
  },
  valueText: { fontSize: 18, fontWeight: "600", opacity: 0.9, paddingLeft: 1 },
  editBtn: { padding: 4 },
  editContainer: { width: "100%" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 0,
    height: 50,
  },
  flexInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 16,
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#00000050",
  },
  unitToggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    padding: 2,
    marginHorizontal: 8,
  },
  actionGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionBtn: {
    borderRadius: 100,
    backgroundColor: "#35353556",
    padding: 6,
    marginLeft: 4,
    elevation: 3,
  },
  unitSmallBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  unitSmallText: { fontSize: 14, fontWeight: "bold" },
  saveBtn: { padding: 4 },
});
