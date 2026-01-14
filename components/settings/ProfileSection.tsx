// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Avatar, ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUser } from "@/contexts/UserContext";
import EditableField from "@/components/shared/EditableField";

const ProfileSection = () => {
  const { user, updateUserName } = useUser() as any;

  const text = useThemeColor({}, "text");
  const textMuted = useThemeColor({}, "text-muted");
  const cardBg = useThemeColor({}, "background");
  const border = useThemeColor({}, "background-seconary");

  const openChangePhoto = () => {
    // Hook this to your actual picker logic
    Alert.alert("Change photo", "Hook this to your image picker flow.", [
      { text: "OK" },
    ]);
  };

  const saveName = async (newName: string) => {
    const trimmed = (newName ?? "").trim();
    if (!trimmed) return;
    await updateUserName(trimmed);
  };

  return (
    <View style={styles.section}>
      <View
        style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
      >
        {/* Avatar */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrap}>
            <Avatar size={156} />

            <TouchableOpacity
              onPress={openChangePhoto}
              activeOpacity={0.85}
              style={styles.avatarOverlayBtn}
            >
              <View
                style={[
                  styles.avatarOverlay,
                  { backgroundColor: "rgba(0,0,0,0.08)" },
                ]}
              >
                <Ionicons name="camera-outline" size={18} color={text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: border }]} />

        {/* Name */}
        <View style={styles.nameBlock}>
          <ThemedText style={[styles.label, { color: textMuted }]}>
            Name
          </ThemedText>

          <EditableField
            value={user?.name ?? ""}
            onSave={saveName}
            type="text"
            iconColor={textMuted as any} // minimal
            iconSize={18}
            containerStyle={styles.editableRow}
            textStyle={[styles.nameText, { color: text }]}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },

  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },

  avatarBlock: {
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
  },
  avatarOverlayBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  avatarOverlay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    opacity: 0.6,
    width: "100%",
  },

  nameBlock: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    opacity: 0.85,
  },

  // keeps spacing consistent with your EditableField
  editableRow: {
    alignItems: "center",
  },

  nameText: {
    fontSize: 18,
    fontWeight: "800",
  },

  helper: {
    fontSize: 12,
    opacity: 0.75,
  },
});
