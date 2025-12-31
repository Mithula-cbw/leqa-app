// Leqa © 2025 Mithula Chanthuka

import { ThemedView } from "@/components/shared";
import TimeRangePicker, { TimePickerValue } from "@/components/ui/TimePicker";
import { Text } from "react-native";

const Analytics = () => {
  const handleTimeChange = (val: TimePickerValue) => {
    console.log("Selected:", val);
  };
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>I am a App Dev</Text>
      <TimeRangePicker 
        onValueChange={handleTimeChange} 
      />
    </ThemedView>
  );
};

export default Analytics;
