import React from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Masthead } from './ui';
import { useTheme } from '@/theme';

/** Page container: cream paper, 16px gutters, max width 560 on web, safe areas; optional black masthead. */
export function Screen({ children, tabbed, masthead, style, ...p }: ScrollViewProps & { children: React.ReactNode; tabbed?: boolean; masthead?: boolean }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView {...p} style={[{ flex: 1, backgroundColor: c.bg }, style]} contentContainerStyle={{ paddingTop: masthead ? 0 : tabbed ? insets.top + 18 : 18, paddingBottom: (tabbed ? 24 : 40) + insets.bottom }} keyboardShouldPersistTaps="handled">
      {masthead ? <Masthead bleed={0} top={insets.top} /> : null}
      <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center', gap: 22, paddingTop: masthead ? 18 : 0, paddingLeft: Math.max(16, insets.left), paddingRight: Math.max(16, insets.right) }}>{children}</View>
    </ScrollView>
  );
}
