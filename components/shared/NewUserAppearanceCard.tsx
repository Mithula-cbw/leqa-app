// Leqa © 2025 Mithula Chanthuka

import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemeMode } from "@/contexts/ThemeContext";
import NewUserThemeButton from "./NewUserThemeButton";

interface Props {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
  onBack: () => void;
  onFinish: () => void;
  tintColor: string;
  borderColor: string;
}

const NewUserAppearanceCard = ({
  theme,
  setTheme,
  onBack,
  onFinish,
  tintColor,
  borderColor,
}: Props) => {
  return (
    <View style={styles.mainContainer}>
      <ThemedText style={styles.title}>Appearance</ThemedText>
      <ThemedText style={styles.subtitle}>
        How would you like the app to look?
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

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: tintColor, width: "100%" },
          ]}
          onPress={onFinish}
        >
          <ThemedText
            style={[
              styles.buttonText,
              { color: theme === "light" ? "#fff" : "#000" },
            ]}
          >
            Get Started
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { width: "100%", alignItems: "center" }]}
        >
          <ThemedText style={{ color: borderColor }}>Back</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewUserAppearanceCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    opacity: 0.7,
  },
  themeContainer: {
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginBottom: 30,
  },
  themeButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    paddingHorizontal: 5,
    gap: 15,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  backButton: {
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
