// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedText from "@/components/shared/themed-text";
import NewUserThemeButton from "@/components/shared/NewUserThemeButton";
import { ThemeMode } from "@/contexts/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
};

const AppearanceSection = ({ theme, setTheme }: Props) => {
  const textMuted = useThemeColor({}, "text-muted");

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
      <ThemedText style={[styles.sectionSub, { color: textMuted }]}>
        Choose a theme.
      </ThemedText>

      <View style={styles.themeContainer}>
        <NewUserThemeButton
          mode="light"
          selected={theme === "light"}
          onPress={() => setTheme("light")}
        />

        <NewUserThemeButton
          mode="dark"
          selected={theme === "dark"}
          onPress={() => setTheme("dark")}
        />
      </View>
    </View>
  );
};

export default AppearanceSection;

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSub: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 14,
  },
  themeContainer: {
    paddingHorizontal: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
});
