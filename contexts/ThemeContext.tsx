// Leqa © 2025 Mithula Chanthuka

import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProviderApp = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemScheme() ?? "light";
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("theme").then(stored => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
      }
      setLoading(false);
    });
  }, []);

  const setTheme = async (value: ThemeMode) => {
    setThemeState(value);
    await AsyncStorage.setItem("theme", value);
  };

  const resolvedTheme = theme === "system" ? systemScheme : theme;

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, loading }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProviderApp");
  return ctx;
};
