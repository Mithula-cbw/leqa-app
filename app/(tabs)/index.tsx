// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/shared";
import { HomeHeader, HomeHero } from "@/features/home";
import { Shadow } from "react-native-shadow-2";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <HomeHero />
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
