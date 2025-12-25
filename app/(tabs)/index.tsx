// Leqa © 2025 Mithula Chanthuka

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Text } from "react-native";

const Index = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Hello my name is Mithula</Text>
      <Link href={"/about"}>
        <ThemedText type="link">Go to About</ThemedText>
      </Link>
    </ThemedView>
  );
};

export default Index;
