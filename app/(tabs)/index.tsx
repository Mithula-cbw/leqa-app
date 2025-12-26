import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import React from "react";
import { Button, Text } from "react-native";

export default function Index() {
  const { user, deleteUser } = useUser();
  const { setTheme } = useTheme();

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="delete User" onPress={() => deleteUser()} />
      <Button title="light mode" onPress={() => setTheme("light")} />
      <Button title="dark mode" onPress={() => setTheme("dark")} />
      <Text>{user ? user.name : "No user"}</Text>
    </ThemedView>
  );
}
