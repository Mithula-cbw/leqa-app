// Leqa © 2025 Mithula Chanthuka

import { useUser } from "@/contexts/UserContext";
import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";

const NewUserSheet = () => {
  const { saveUser } = useUser();
  const [name, setName] = useState("");

  const handleAddUser = async () => {
    if (!name.trim()) return;
    await saveUser(name.trim());
  };

  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText style={{ fontSize: 18, marginBottom: 10 }}>Welcome 👋</ThemedText>

      <ThemedText style={{ marginBottom: 12 }}>
        Please tell us your name to continue.
      </ThemedText>

      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 16,
        }}
      />

      <Button
        title="Continue"
        onPress={handleAddUser}
        disabled={!name.trim()}
      />
    </ThemedView>
  );
};

export default NewUserSheet;
