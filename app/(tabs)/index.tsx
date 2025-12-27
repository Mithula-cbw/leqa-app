// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/shared";
import { FloatingActionButtons, HomeHeader, HomeHero } from "@/features/home";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <HomeHero />
      <FloatingActionButtons
        onAdd={() => console.log("Primary FAB")}
        onRemove={() => console.log("Secondary FAB")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 2,
    paddingTop: 20,
  },
});
