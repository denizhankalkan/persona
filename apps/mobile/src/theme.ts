import { useColorScheme } from 'react-native';

/**
 * Siyah · Krem · Turkuaz. Cream paper for pages, black bands for mastheads and the tab bar,
 * one accent: Pantone 15-5217 TCX "Blue Turquoise" — Tiffany's blue and İznik's turquoise.
 * Square corners, hairline rules, tracked uppercase labels; the Ottoman touch is a single
 * motif (tulip and curling vine) drawn faintly on black only. Ratio: cream 80 · black 15 · turquoise 5.
 */
export const TIFFANY = '#53B0AE';

export const palette = {
  light: {
    bg: '#F3EEE3', surface: '#F3EEE3', surface2: '#EAE3D5', fg: '#0B0B0B', muted: '#6E6A5F', line: '#D9D1C0', rule: '#0B0B0B',
    accent: TIFFANY, accentInk: '#0B0B0B', accentSoft: '#DCEFEE', ink: '#0B0B0B', inkFg: '#F3EEE3', inkMuted: '#A3A3A3',
    gold: '#0B0B0B', danger: '#B4473A',
  },
  dark: {
    bg: '#0B0B0B', surface: '#0B0B0B', surface2: '#1A1917', fg: '#F3EEE3', muted: '#A39E92', line: '#2A2824', rule: '#F3EEE3',
    accent: '#6FC4C1', accentInk: '#0B0B0B', accentSoft: '#12302F', ink: '#0B0B0B', inkFg: '#F3EEE3', inkMuted: '#8C877C',
    gold: '#F3EEE3', danger: '#E07A6A',
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
