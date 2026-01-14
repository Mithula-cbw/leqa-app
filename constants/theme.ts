// Leqa © 2025 Mithula Chanthuka

import { Platform } from "react-native";

const tintColorLight = "#ffffffff";
const tintColorDark = "#E6D84A";
const accentLight = "#FFBD75";
const accentDark = "rgb(238, 255, 0)";

export const Colors = {
  light: {
    text: "#000000",
    "text-primary": "#ffffff",
    "text-title": "#000000",
    "text-subtitle": "#3f3f3fff",
    "text-muted": "#525252ff",
    background: "#FFFFFF",
    "background-muted": "#AA927A",
    "background-seconary": "#f1ece8d8",
    sheet: "#FFFFFF",
    tint: tintColorLight,
    highlight: "#AA927A",
    accent: accentLight,
    "tint-muted": "#C9AE9C",
    icon: "#6B7075",
    tabIconDefault: "#e6e6e6ff",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    "text-primary": "#000000",
    "text-title": "#fff",
    "text-subtitle": "#fbf2caff",
    "text-muted": "#B5B8BC",
    background: "rgb(15, 14, 13)",
    "background-muted": "rgb(64, 64, 61)",
    "background-seconary": "#6261548c",
    sheet: "rgb(16, 16, 16)",
    tint: tintColorDark,
    accent: accentDark,
    highlight: "#cec983",
    "tint-muted": "#BFB63A",
    icon: "#bababaff",
    tabIconDefault: "#c4c4c4ff",
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
