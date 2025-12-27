// Leqa © 2025 Mithula Chanthuka

import { ProfileImagePicker, ThemedView } from "@/components/shared";
import { useUser } from "@/contexts/UserContext";
import { Button, Text } from "react-native";

const Settings = () => {
  const { deleteUser } = useUser();
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Settings Here</Text>
      <Button title="delete User" onPress={() => deleteUser()} />
      <ProfileImagePicker />
    </ThemedView>
  );
};

export default Settings;
