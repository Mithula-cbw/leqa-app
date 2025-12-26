// Leqa © 2025 Mithula Chanthuka

import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemeMode } from "@/contexts/ThemeContext";

const NewUserAppearanceCard = ({
  theme,
  setTheme,
  onBack,
  onFinish,
  tintColor,
  borderColor,
}: {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
  onBack: () => void;
  onFinish: () => void;
  tintColor: string;
  borderColor: string;
}) => {
  const ThemeOption = ({
    label,
    value,
  }: {
    label: string;
    value: typeof theme;
  }) => (
    <TouchableOpacity
      style={[
        styles.themeButton,
        { borderColor: theme === value ? tintColor : borderColor },
      ]}
      onPress={() => setTheme(value)}
    >
      <ThemedText style={{ color: theme === value ? tintColor : undefined }}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View>
      <ThemedText style={styles.title}>Appearance</ThemedText>
      <ThemedText style={styles.subtitle}>
        How would you like the app to look?
      </ThemedText>

      <View style={styles.themeContainer}>
        <ThemeOption label="Light" value="light" />
        <ThemeOption label="Dark" value="dark" />
        <ThemeOption label="System" value="system" />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={{ color: borderColor }}>Back</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: tintColor, flex: 1 },
          ]}
          onPress={onFinish}
        >
          <ThemedText style={styles.buttonText}>Get Started</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewUserAppearanceCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 2,
    overflow: "hidden",
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  themeContainer: {
    flexDirection: "row",
    gap: 10,
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
    flexDirection: "row",
    alignItems: "center",
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
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
