import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/shared";

const QuantityPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (qty: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(String(value));

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => onChange(Math.max(0, value - 1))}>
          <ThemedText>-</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setOpen(true)}>
          <ThemedText style={{ marginHorizontal: 12 }}>
            {value}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChange(value + 1)}>
          <ThemedText>+</ThemedText>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={open} animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={{ padding: 20 }}>
            <TextInput
              keyboardType="number-pad"
              value={input}
              onChangeText={setInput}
              placeholder="Enter quantity"
            />

            {[5, 10, 25, 50].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => {
                  onChange(n);
                  setInput(String(n));
                  setOpen(false);
                }}
              >
                <ThemedText>{n}</ThemedText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => {
                const qty = parseInt(input, 10);
                if (!isNaN(qty)) onChange(qty);
                setOpen(false);
              }}
            >
              <ThemedText>Confirm</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default QuantityPicker;