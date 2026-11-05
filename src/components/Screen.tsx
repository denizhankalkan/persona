import React from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

/** Page container: white page, 16px gutters, max width 560 on web, safe areas. */
export function Screen({ children, tabbed, style, ...p }: ScrollViewProps & { children: React.ReactNode; tabbed?: boolean }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView {...p} style={[{ flex: 1, backgroundColor: c.bg }, style]} contentContainerStyle={{ paddingTop: 18, paddingBottom: (tabbed ? 24 : 40) + insets.bottom, paddingLeft: Math.max(16, insets.left), paddingRight: Math.max(16, insets.right) }} keyboardShouldPersistTaps="handled">
      <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center', gap: 22 }}>{children}</View>
    </ScrollView>
  );
}
