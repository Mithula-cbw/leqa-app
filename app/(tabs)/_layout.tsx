// Leqa © 2025 Mithula Chanthuka

import { useThemeColor } from "@/hooks/use-theme-color";
import { Tabs } from "expo-router";
import { Octicons } from "@expo/vector-icons";

export default function RootLayout() {
  const activeTint = useThemeColor({}, "tint");
  const inactiveTint = useThemeColor({}, "tabIconDefault");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        headerShown: false,
        tabBarStyle: {
          paddingTop: 5,
          height: 75,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Octicons
              name={focused ? "bookmark-filled" : "bookmark"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "About",
        }}
      />
    </Tabs>
  );
}
