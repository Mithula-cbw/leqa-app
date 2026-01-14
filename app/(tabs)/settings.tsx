// Leqa © 2025 Mithula Chanthuka

import React, { useMemo, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/shared";
import ThemedText from "@/components/shared/themed-text";

import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext"; // adjust if your hook name differs
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  AppearanceSection,
  DangerZoneSection,
  ProfileSection,
} from "@/components/settings";

const Settings = () => {
  const cardBg = useThemeColor({}, "background");
  const border = useThemeColor({}, "background-seconary");
  const textMuted = useThemeColor({}, "text-muted");

  const { deleteUser, user, updateUser } = useUser() as any;
  const { theme, setTheme } = useTheme() as any;

  // Local draft for “edit name in place”
  const initialName = useMemo(() => user?.name ?? "", [user?.name]);
  const [nameDraft, setNameDraft] = useState(initialName);

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;

    await updateUser?.({ name: trimmed });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textMuted }]}>
            Manage your profile, appearance, and data.
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <ProfileSection />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <AppearanceSection theme={theme} setTheme={setTheme} />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <DangerZoneSection onDeleteAll={() => deleteUser()} />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingTop: 74,
    padding: 16,
    gap: 14,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.9,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
});
