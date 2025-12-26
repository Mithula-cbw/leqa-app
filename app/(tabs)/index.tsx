// Leqa © 2025 Mithula Chanthuka

import { StyleSheet } from "react-native";
import HomeHeader from "@/features/home/Header";
import React from "react";
import { ThemedView } from "@/components/shared";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingTop: 20,
  }
});