import { useUser } from "@/contexts/UserContext";
import React from "react";
import { View, Button, Text } from "react-native";

export default function Index() {
  const { user, deleteUser } = useUser();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="delete User" onPress={() => deleteUser()} />
      <Text>{user ? user.name : "No user"}</Text>
    </View>
  );
}
