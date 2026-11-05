import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';

function Glyph({ ch, focused }: { ch: string; focused: boolean }) {
  const { c, f } = useTheme();
  return <Text style={{ fontFamily: f.display, fontSize: 20, lineHeight: 24, color: focused ? c.accent : '#A3A3A3' }}>{ch}</Text>;
}

/** Letterboxd's green plus, in turquoise: the catalog grows from here. */
function AddButton() {
  const { c, f } = useTheme();
  const { t } = useT();
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/ekle')} accessibilityLabel={t('Ekle')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: f.display, fontSize: 28, lineHeight: 32, color: '#0B0B0B' }}>+</Text>
      </View>
    </Pressable>
  );
}

/** Akış · Keşfet · (+) · Ekranda · Dolabım — black bar, cream glyphs, turquoise when active. */
export default function TabsLayout() {
  const { c, f } = useTheme();
  const { t, lang } = useT();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0B0B0B', borderTopColor: '#0B0B0B', height: 64, paddingTop: 6 },
        tabBarActiveTintColor: '#F3EEE3',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarLabelStyle: { fontFamily: f.bodyBold, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('Akış'), tabBarIcon: ({ focused }) => <Glyph ch={lang === 'tr' ? 'A' : 'F'} focused={focused} /> }} />
      <Tabs.Screen name="kesfet" options={{ title: t('Keşfet'), tabBarIcon: ({ focused }) => <Glyph ch={lang === 'tr' ? 'K' : 'D'} focused={focused} /> }} />
      <Tabs.Screen name="ekle" options={{ title: '', tabBarButton: () => <AddButton /> }} />
      <Tabs.Screen name="ekranda" options={{ title: t('Ekranda'), tabBarIcon: ({ focused }) => <Glyph ch={lang === 'tr' ? 'E' : 'S'} focused={focused} /> }} />
      <Tabs.Screen name="dolabim" options={{ title: t('Dolabım'), tabBarIcon: ({ focused }) => <Glyph ch={lang === 'tr' ? 'D' : 'W'} focused={focused} /> }} />
    </Tabs>
  );
}
