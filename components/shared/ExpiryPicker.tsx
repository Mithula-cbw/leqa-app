import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/shared";
import DateTimePicker from '@react-native-community/datetimepicker';

const ExpiryPicker = ({ value, onChange }: {
  value?: Date;
  onChange: (date: Date) => void;
}) => {
  const [mode, setMode] = useState<"date" | "time" | null>(null);
  const date = value ?? new Date();

  return (
    <>
      <TouchableOpacity onPress={() => setMode("date")}>
        <ThemedText>
          {date.toLocaleString()}
        </ThemedText>
      </TouchableOpacity>

      {mode && (
        <DateTimePicker
          value={date}
          mode={mode}
          onChange={(_, selected) => {
            if (!selected) return setMode(null);

            if (mode === "date") {
              const updated = new Date(date);
              updated.setFullYear(
                selected.getFullYear(),
                selected.getMonth(),
                selected.getDate()
              );
              onChange(updated);
              setMode("time");
            } else {
              const updated = new Date(date);
              updated.setHours(
                selected.getHours(),
                selected.getMinutes()
              );
              onChange(updated);
              setMode(null);
            }
          }}
        />
      )}
    </>
  );
};

export default ExpiryPicker;