// Leqa © 2025 Mithula Chanthuka

import { Platform } from "react-native";

const tintColorLight = "#8a7462";
const tintColorDark = "#fffc35f8";

export const Colors = {
  light: {
    text: "#11181C",
    "text-muted": "rgba(22, 27, 30, 1)",
    background: "#fff",
    "background-muted": "#e0e0e0ff",
    tint: tintColorLight,
    "tint-muted": "#D1B4A0",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    "text-muted": "rgba(222, 222, 222, 1)",
    background: "#1c1c1cff",
    "background-muted": "#333333ff",
    tint: tintColorDark,
    "tint-muted": "#c4c000ce",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
