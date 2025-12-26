// Leqa © 2025 Mithula Chanthuka

import { useUser } from "@/contexts/UserContext";
import { StyleSheet, Animated } from "react-native";
import { useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { NewUserAppearanceCard, NewUserNameCard, ThemedView } from "@/components/shared";

const NewUserSheet = () => {
  const { saveUser } = useUser();
  const { theme, setTheme } = useTheme();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

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

  return (
    <ThemedView style={[styles.container, { minHeight: 300 }]}>
      <Animated.View
        style={{
          opacity,
          transform: [{ translateX }],
        }}
      >
        {step === 1 ? (
          <NewUserNameCard
            name={name}
            onChangeName={setName}
            onNext={() => animateToStep(2)}
          />
        ) : (
          <NewUserAppearanceCard
            theme={theme}
            setTheme={setTheme}
            onBack={() => animateToStep(1)}
            onFinish={handleFinalize}
          />
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
