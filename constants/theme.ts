// Leqa © 2025 Mithula Chanthuka

import { Platform } from "react-native";

const tintColorLight = "#ffffffff";
const tintColorDark = "#E6D84A";
const accentLight = "#FFBD75";
const accentDark = "#FFBD75";

export const Colors = {
  light: {
    text: "#000000",
    "text-title": "#000000",
    "text-subtitle": "#3f3f3fff",
    "text-muted": "#525252ff",
    background: "#FFFFFF",
    "background-muted": "#AA927A",
    "background-seconary": "#f1ece8d8",
    "sheet": "#FFFFFF",
    tint: tintColorLight,
    accent: accentLight,
    "tint-muted": "#C9AE9C",
    icon: "#6B7075",
    tabIconDefault: "#e6e6e6ff",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    "text-title": "#fff",
    "text-subtitle": "#fbf2caff",
    "text-muted": "#B5B8BC",
    background: "#262521ff",
    "background-muted": "#62625dff",
    "background-seconary": "#0000008c",
    "sheet": "#333333ff",
    tint: tintColorDark,
    accent: accentDark,
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
