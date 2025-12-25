// Leqa © 2025 Mithula Chanthuka

import { useThemeColor } from "@/hooks/use-theme-color";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
          paddingHorizontal: 10,
          height: 60,
          borderRadius: 35,
          marginBottom: 25,
          marginHorizontal: 15,
          backgroundColor: useThemeColor({}, "background-muted"),
          position: "absolute",
          borderTopWidth: 0,
          opacity: 0.96,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "storefront-sharp" : "storefront-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Products",
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "podium-sharp" : "podium-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Analytics",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
