// Leqa © 2025 Mithula Chanthuka

import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import React, { useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import ThemedText from "./themed-text";

interface Props {
  mode: "light" | "dark";
  selected: boolean;
  onPress: () => void;
}

const NewUserThemeButton = ({
  mode,
  selected,
  onPress,
}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "highlight");

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const isLight = mode === "light";

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }], width: "100%" }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          style={[
            styles.card,
            { borderColor: selected ? tintColor : "transparent" },
          ]}
        >
          {/* Background Wallpaper */}
          <ImageBackground
            source={
              isLight
                ? require("@/assets/images/light-bg.jpg") 
                : require("@/assets/images/dark-bg.jpg")
            }
            style={styles.previewContainer}
            imageStyle={{ borderRadius: 10 }}
          >
            {!isLight && <View style={styles.darkOverlay} />}

            {/* Mock UI Elements */}
            <View
              style={[
                styles.mockCard,
                isLight ? styles.lightMock : styles.darkMock,
              ]}
            >
              <View
                style={[
                  styles.mockLine,
                  {
                    width: "40%",
                    backgroundColor: isLight ? "#94a3b8" : "#64748b",
                  },
                ]}
              />
              <View
                style={[
                  styles.mockLine,
                  {
                    width: "80%",
                    backgroundColor: isLight ? "#cbd5e1" : "#475569",
                  },
                ]}
              />
            </View>

            <View
              style={[
                styles.mockCard,
                isLight ? styles.lightMock : styles.darkMock,
              ]}
            >
              <View
                style={[
                  styles.mockLine,
                  {
                    width: "30%",
                    backgroundColor: isLight ? "#94a3b8" : "#64748b",
                  },
                ]}
              />
              <View
                style={[
                  styles.mockLine,
                  {
                    width: "90%",
                    backgroundColor: isLight ? "#cbd5e1" : "#475569",
                  },
                ]}
              />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>

      <ThemedText
        style={[
          styles.label,
          { color: selected ? tintColor : textColor },
        ]}
      >
        {mode.charAt(0).toUpperCase() + mode.slice(1)} mode
      </ThemedText>
    </View>
  );
};

export default NewUserThemeButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  card: {
    width: "100%",
    aspectRatio: 0.85,
    borderRadius: 14,
    borderWidth: 3,
    padding: 2,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  mockCard: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    padding: 10,
    gap: 8,
    justifyContent: "center",
  },
  lightMock: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  darkMock: {
    backgroundColor: "rgba(30,30,30,0.8)",
  },
  mockLine: {
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
