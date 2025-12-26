// Leqa © 2025 Mithula Chanthuka

import { Platform } from 'react-native';

const tintColorLight = '#8a7462';
const tintColorDark = '#fffc35ff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    "background-muted": '#e0e0e0ff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1c1c1cff',
    "background-muted": '#333333ff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
