// Leqa © 2025 Mithula Chanthuka

import { useThemeColor } from "@/hooks/use-theme-color";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/contexts/UserContext";
import NewUserSheet from "@/components/shared/NewUserSheet";
import { useEffect, useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";

export default function RootLayout() {
  const { user, loading } = useUser();
  const [sheetVisible, setSheetVisible] = useState(false);
  const activeTint = useThemeColor({}, "tint");
  const inactiveTint = useThemeColor({}, "tabIconDefault");
  const bgColor = useThemeColor({}, "background-muted");

  useEffect(() => {
    setSheetVisible(!loading && !user);
  }, [user, loading]);

  return (
    <>
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
            backgroundColor: bgColor,
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

      {/* New user Overlay sheet */}
      <BottomSheet
        visible={sheetVisible}
        onOverlayClose={false}
        showCloseButton={false}
        onClose={() => setSheetVisible(false)}
      >
        <NewUserSheet />
      </BottomSheet>
    </>
  );
}
