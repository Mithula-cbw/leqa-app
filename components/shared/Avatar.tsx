// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/use-theme-color";

interface AvatarProps {
  size?: number;
}

const Avatar = ({ size = 48 }: AvatarProps) => {
  const { user } = useUser();

  const tintColor = useThemeColor({}, "tint");
  const bgColor = useThemeColor({}, "background-muted");

  const getInitials = () => {
    if (!user?.name) return "U";

    // Gets first letter of first and last name, or just first letter
    const parts = user.name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const dynamicStyles = {
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    text: {
      fontSize: size * 0.4,
    },
  };

  if (user?.image) {
    return (
      <Image
        source={{ uri: user.image }}
        style={[styles.base, dynamicStyles.container]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.fallback,
        dynamicStyles.container,
        { backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.initials, dynamicStyles.text, { color: tintColor }]}>
        {getInitials()}
      </Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  fallback: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  initials: {
    fontWeight: "700",
  },
});
