// Leqa © 2025 Mithula Chanthuka

import { Platform } from "react-native";

const tintColorLight = "#8A7462";
const tintColorDark = "#E6D84A";

export const Colors = {
  light: {
    text: "#11181C",
    "text-title": "#000000",
    "text-subtitle": "#3a3427ff",
    "text-muted": "#4A4F55",
    background: "#c6c2b5ff",
    "background-muted": "#F2F2F2",
    tint: tintColorLight,
    "tint-muted": "#C9AE9C",
    icon: "#6B7075",
    tabIconDefault: "#6B7075",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    "text-title": "#fff",
    "text-subtitle": "#fff0af",
    "text-muted": "#B5B8BC",
    background: "#1C1C1C",
    "background-muted": "#2A2A2A",
    tint: tintColorDark,
    "tint-muted": "#BFB63A",
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
