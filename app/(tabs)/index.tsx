import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUser } from "@/contexts/UserContext";
import React from "react";

export default function Index() {
  const { user } = useUser();

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>{user ? user.name : "No user"}</ThemedText>
    </ThemedView>
  );
}
