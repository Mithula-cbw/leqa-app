// Leqa © 2025 Mithula Chanthuka

import { useUser } from "@/contexts/UserContext";
import { View, Text, Button } from "react-native";

const NewUserSheet = () => {
  const { saveUser } = useUser();

  const handleAddUser = async () => {
    await saveUser("mithula");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Welcome 👋
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Please tell us your name to continue.
      </Text>

      <Button title="Add User" onPress={handleAddUser} />
    </View>
  );
};

export default NewUserSheet;
