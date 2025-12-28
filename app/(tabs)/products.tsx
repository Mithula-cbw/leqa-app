// Leqa © 2025 Mithula Chanthuka

import { ThemedText, ThemedView } from "@/components/shared";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";

const Products = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>I am a App Dev</Text>
      <Link href="/add-product" asChild>
        <Pressable>
          <ThemedText>Add New Product</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
};

export default Products;
