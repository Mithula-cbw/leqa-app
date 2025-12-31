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
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value.toString());

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
      <View style={[styles.editRow, containerStyle]}>
        <TextInput
          style={[styles.input, textStyle]}
          value={currentValue}
          onChangeText={setCurrentValue}
          keyboardType={type === "numeric" ? "numeric" : "default"}
          autoFocus
          selectTextOnFocus
        />
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
    );
  }

  return (
    <View style={[styles.viewRow, containerStyle]}>
      <ThemedText style={textStyle}>
        {formatText(`${value}`, "title")}
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
    alignItems: "center",
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
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flex: 1,
  },
  actionBtn: {
    borderRadius: 100,
    backgroundColor: "#35353556",
    padding: 6,
    marginLeft: 4,
    elevation: 3,
  },
  editBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
