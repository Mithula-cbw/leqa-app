// Leqa © 2025 Mithula Chanthuka

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProviderApp, useTheme } from "@/contexts/ThemeContext";
import { initializeDatabase } from "@/db/schema";

function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, loading } = useTheme();

  if (loading) return null;

  return (
    <ThemeProvider value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="leqa_app.db" onInit={initializeDatabase}>
      <UserProvider>
        <ThemeProviderApp>
          <SafeAreaProvider>
            <NavigationThemeWrapper>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </NavigationThemeWrapper>
          </SafeAreaProvider>
        </ThemeProviderApp>
      </UserProvider>
    </SQLiteProvider>
  );
}
