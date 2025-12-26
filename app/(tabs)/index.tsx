import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUser } from "@/contexts/UserContext";
import React from "react";
import { Button } from "react-native";

export default function Index() {
  const { user, deleteUser } = useUser();

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="delete User" onPress={() => deleteUser()} />
      <ThemedText>{user ? user.name : "No user"}</ThemedText>
    </ThemedView>
  );
}
