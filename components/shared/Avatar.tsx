import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";

interface AvatarProps {
  size?: number;
}

const GAP = 2;

const Avatar = ({ size = 48 }: AvatarProps) => {
  const { user } = useUser();
  const router = useRouter();

  const tintColor = useThemeColor({}, "tint");
  const bgColor = useThemeColor({}, "background-muted");
  const borderColor = useThemeColor({}, "background-seconary");

  const getInitials = () => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const outerSize = size + GAP * 2;

  return (
    <Pressable
      onPress={() => router.push("/settings")}
      hitSlop={8}
      style={[
        styles.border,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          borderColor,
        },
      ]}
    >
      {user?.image ? (
        <Image
          source={{ uri: user.image }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: size * 0.4, color: tintColor },
            ]}
          >
            {getInitials()}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  border: {
    padding: 2,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    overflow: "hidden",
    elevation: 2,
  },
  fallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontWeight: "700",
  },
});
