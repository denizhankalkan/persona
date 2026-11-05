import { useColorScheme } from 'react-native';

/**
 * Vogue.com register: white page, black type, hairline rules, square corners, tracked
 * uppercase labels. One accent only — Pantone 15-5217 TCX "Blue Turquoise" (Tiffany blue),
 * used for links, the active tab, the + button and small kickers.
 */
export const TIFFANY = '#53B0AE';

export const palette = {
  light: {
    bg: '#FFFFFF', surface: '#FFFFFF', surface2: '#F3F3F3', fg: '#000000', muted: '#6B6B6B', line: '#E4E4E4', rule: '#000000',
    accent: TIFFANY, accentInk: '#FFFFFF', accentSoft: '#E6F3F2', ink: '#000000', inkFg: '#FFFFFF', inkMuted: '#A3A3A3',
    gold: '#000000', danger: '#B4473A',
  },
  dark: {
    bg: '#000000', surface: '#000000', surface2: '#161616', fg: '#FFFFFF', muted: '#9A9A9A', line: '#2A2A2A', rule: '#FFFFFF',
    accent: '#7CC9C7', accentInk: '#000000', accentSoft: '#12302F', ink: '#FFFFFF', inkFg: '#000000', inkMuted: '#6B6B6B',
    gold: '#FFFFFF', danger: '#E07A6A',
  },
};
export type Colors = typeof palette.light;

export const fonts = {
  display: 'BodoniModa_500Medium',
  displayRegular: 'BodoniModa_400Regular',
  displayItalic: 'BodoniModa_400Regular_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemi: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
};

export function useTheme() {
  const scheme = useColorScheme();
  return { c: scheme === 'dark' ? palette.dark : palette.light, dark: scheme === 'dark', f: fonts };
}

/** square everything; circles only for avatars and the + button */
export const radius = { sm: 0, md: 0, lg: 0, pill: 0 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 32 };
