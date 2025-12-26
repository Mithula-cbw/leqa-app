// Leqa © 2025 Mithula Chanthuka

import { useUser } from "@/contexts/UserContext";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTheme } from "@/contexts/ThemeContext";

const NewUserSheet = () => {
  const { saveUser } = useUser();
  const { theme, setTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");

  // Animation values
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "tabIconDefault");

  const animateToStep = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: nextStep > step ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);

      translateX.setValue(nextStep > step ? 20 : -20);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleFinalize = async () => {
    if (!name.trim()) return;
    await saveUser(name.trim());
  };

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
    <ThemedView style={[styles.container, { minHeight: 300 }]}>
      <Animated.View
        style={{
          opacity: opacity,
          transform: [{ translateX: translateX }],
        }}
      >
        {step === 1 ? (
          /* Step 2 */
          <View>
            <ThemedText style={styles.title}>Welcome 👋</ThemedText>
            <ThemedText style={styles.subtitle}>
              Please tell us your name to continue.
            </ThemedText>

            <TextInput
              placeholder="Your name"
              placeholderTextColor={borderColor}
              value={name}
              onChangeText={setName}
              autoFocus
              style={[styles.input, { borderColor: borderColor }]}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: name.trim() ? tintColor : borderColor },
              ]}
              onPress={() => animateToStep(2)}
              disabled={!name.trim()}
            >
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          /* Step 2 */
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
              <TouchableOpacity
                onPress={() => animateToStep(1)}
                style={styles.backButton}
              >
                <ThemedText style={{ color: borderColor }}>Back</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: tintColor, flex: 1 },
                ]}
                onPress={handleFinalize}
              >
                <ThemedText style={styles.buttonText}>Get Started</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </ThemedView>
  );
};

export default NewUserSheet;

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
