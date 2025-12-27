// Leqa © 2025 Mithula Chanthuka

import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/shared";
import { FloatingActionButtons, HomeHeader, HomeHero } from "@/features/home";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function Index() {
  const bgSecondary = useThemeColor({}, "background-seconary");
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <HomeHero />
      <View style={[styles.content, { backgroundColor: bgSecondary }]}>
        <FloatingActionButtons
          onAdd={() => console.log("Primary FAB")}
          onRemove={() => console.log("Secondary FAB")}
        />
      </View>
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
  content: {
    flex: 1,
    width: "100%",
    marginTop: 35,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36
  },
});
