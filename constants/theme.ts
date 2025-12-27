// Leqa © 2025 Mithula Chanthuka

import { Platform } from "react-native";

const tintColorLight = "#8A7462";
const tintColorDark = "#E6D84A";
const accentLight = "#FFBD75";
const accentDark = "#FFBD75";

export const Colors = {
  light: {
    text: "#615B54",
    "text-title": "#ffffff",
    "text-subtitle": "#E8E8E8",
    "text-muted": "#4A4F55",
    background: "#BEA691",
    "background-muted": "#E2E2E2",
    "background-seconary": "#ffffff8c",
    "sheet": "#e0d4cae6",
    tint: tintColorLight,
    accent: accentLight,
    "tint-muted": "#C9AE9C",
    icon: "#6B7075",
    tabIconDefault: "#615B54",
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
