// Leqa © 2025 Mithula Chanthuka

import { useThemeColor } from "@/hooks/use-theme-color";
import { Tabs } from "expo-router";

export default function RootLayout() {
   const backgroundColor = useThemeColor({}, 'tint');
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: backgroundColor,
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="about" options={{ headerShown: false }} />
    </Tabs>
  );
}
