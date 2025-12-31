import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  BackHandler,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { formatText } from "@/utils/formatText";

interface EditableFieldProps {
  value: string | number;
  onSave: (newValue: any) => Promise<void>;
  type?: "text" | "numeric";
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  multiline?: boolean;
}

const EditableField = ({
  value,
  onSave,
  type = "text",
  textStyle,
  iconStyle,
  iconColor = "gray",
  containerStyle,
  iconSize = 16,
  multiline = false,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value?.toString() || "");

  // Reset internal state when the external value changes
  useEffect(() => {
    setCurrentValue(value?.toString() || "");
  }, [value]);

  // Ensure editing mode is closed when component unmounts
  useEffect(() => {
    return () => {
      setIsEditing(false);
    };
  }, []);

  // Handle Hardware Back Button on Android
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

  const handleSave = async () => {
    const formattedValue =
      type === "numeric" ? Number(currentValue) : currentValue;
    try {
      await onSave(formattedValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  if (isEditing) {
    return (
      <View
        style={[multiline ? styles.editColumn : styles.editRow, containerStyle]}
      >
        <TextInput
          style={[styles.input, textStyle, multiline && styles.multilineInput]}
          value={currentValue}
          onChangeText={setCurrentValue}
          keyboardType={type === "numeric" ? "numeric" : "default"}
          autoFocus
          selectTextOnFocus
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
        />
        <View
          style={[styles.actionGroup, multiline && styles.actionGroupMultiline]}
        >
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
    );
  }

  return (
    <View style={[styles.viewRow, containerStyle]}>
      <ThemedText style={[styles.text, textStyle]}>
        {multiline ? value : formatText(`${value}`, "title")}
      </ThemedText>
      <TouchableOpacity
        onPress={() => setIsEditing(true)}
        style={[styles.editBtn, iconStyle]}
      >
        <MaterialIcons name="mode-edit" size={iconSize} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default EditableField;

const styles = StyleSheet.create({
  viewRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.3)",
    minHeight: 40,
  },
  editColumn: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.3)",
    paddingBottom: 8,
  },
  text: {
    flexShrink: 1,
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    flex: 1,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 8,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionGroupMultiline: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  actionBtn: {
    borderRadius: 100,
    backgroundColor: "#35353556",
    padding: 6,
    marginLeft: 8,
    elevation: 3,
  },
  editBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
