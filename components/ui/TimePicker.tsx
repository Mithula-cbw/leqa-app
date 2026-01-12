import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

export interface TimePickerValue {
  year: number;
  month: number;
  day: number;
  hour: number;
}

interface TimePickerProps {
  initialValue?: TimePickerValue;
  startYear?: number;
  endYear?: number;
  onValueChange: (value: TimePickerValue) => void;
  accentColor?: string;
  hideYear?: boolean;
}

interface WheelProps {
  data: number[];
  selectedValue: number;
  label: string;
  onSelect: (value: number) => void;
  accentColor: string;
  min?: number;
  max?: number;
}

const EditableWheel: React.FC<WheelProps> = ({
  data,
  selectedValue,
  label,
  onSelect,
  accentColor,
  min = 0,
  max = 99,
}) => {
  const [inputValue, setInputValue] = useState(
    selectedValue.toString().padStart(label === "Year" ? 4 : 2, "0")
  );

  React.useEffect(() => {
    setInputValue(
      selectedValue.toString().padStart(label === "Year" ? 4 : 2, "0")
    );
  }, [selectedValue, label]);

  const handleTextChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    setInputValue(cleanText);
  };

  const handleEndEditing = () => {
    let num = parseInt(inputValue, 10);
    if (isNaN(num) || num < min) num = min;
    if (num > max) num = max;

    setInputValue(num.toString().padStart(label === "Year" ? 4 : 2, "0"));
    onSelect(num);
  };

  const handleIncrement = () => {
    const currentIndex = data.indexOf(selectedValue);
    if (currentIndex < data.length - 1) {
      onSelect(data[currentIndex + 1]);
    } else if (currentIndex === -1 && selectedValue < max) {
      onSelect(selectedValue + 1);
    }
  };

  const handleDecrement = () => {
    const currentIndex = data.indexOf(selectedValue);
    if (currentIndex > 0) {
      onSelect(data[currentIndex - 1]);
    } else if (currentIndex === -1 && selectedValue > min) {
      onSelect(selectedValue - 1);
    }
  };

  return (
    <View style={styles.wheelContainer}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={handleIncrement}
        activeOpacity={0.7}
        style={styles.arrowBtn}
      >
        <Ionicons name="caret-up-outline" size={20} color={accentColor} />
      </TouchableOpacity>

      <View style={[styles.box, { borderColor: accentColor }]}>
        <TextInput
          style={styles.boxInput}
          value={inputValue}
          onChangeText={handleTextChange}
          onEndEditing={handleEndEditing}
          keyboardType="number-pad"
          maxLength={label === "Year" ? 4 : 2}
          selectTextOnFocus
          returnKeyType="done"
        />
      </View>

      <TouchableOpacity
        onPress={handleDecrement}
        activeOpacity={0.7}
        style={styles.arrowBtn}
      >
        <Ionicons name="caret-down-outline" size={20} color={accentColor} />
      </TouchableOpacity>
    </View>
  );
};

const TimeRangePicker: React.FC<TimePickerProps> = ({
  initialValue,
  startYear = 2020,
  endYear = 2030,
  onValueChange,
  accentColor = "#57400fff",
  hideYear = false, // Default to showing the year
}) => {
  const [values, setValues] = useState<TimePickerValue>(
    initialValue || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
    }
  );

  const years = useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  );
  const months = useMemo(() => Array.from({ length: 13 }, (_, i) => i), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const daysInMonthArray = useMemo(() => {
    const date = new Date(values.year, values.month, 0);
    const count = date.getDate();
    return Array.from({ length: count + 1 }, (_, i) => i);
  }, [values.year, values.month]);

  const updateValue = (key: keyof TimePickerValue, val: number) => {
    const newState = { ...values, [key]: val };

    if (key === "month" || key === "year") {
      const lastDay = new Date(newState.year, newState.month, 0).getDate();
      if (newState.day > lastDay) newState.day = lastDay;
    }

    setValues(newState);
    onValueChange(newState);
  };

  return (
    <View style={styles.container}>
      {!hideYear && (
        <EditableWheel
          label="Year"
          data={years}
          selectedValue={values.year}
          onSelect={(v) => updateValue("year", v)}
          accentColor={accentColor}
          min={startYear}
          max={endYear}
        />
      )}
      <EditableWheel
        label="Month"
        data={months}
        selectedValue={values.month}
        onSelect={(v) => updateValue("month", v)}
        accentColor={accentColor}
        min={0}
        max={12}
      />
      <EditableWheel
        label="Day"
        data={daysInMonthArray}
        selectedValue={values.day}
        onSelect={(v) => updateValue("day", v)}
        accentColor={accentColor}
        min={0}
        max={31}
      />
      <View style={styles.separator}>
        <Text style={styles.separatorText}>:</Text>
      </View>
      <EditableWheel
        label="Hour"
        data={hours}
        selectedValue={values.hour}
        onSelect={(v) => updateValue("hour", v)}
        accentColor={accentColor}
        min={0}
        max={23}
      />
    </View>
  );
};

export default TimeRangePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wheelContainer: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  label: {
    fontSize: 10,
    color: "#8e8e93",
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  box: {
    width: 60,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  boxInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  arrowBtn: {
    padding: 6,
  },
  separator: {
    paddingTop: 22,
    marginHorizontal: 2,
  },
  separatorText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#c7c7cc",
  },
});
