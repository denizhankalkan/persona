import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, BodoniModa_400Regular, BodoniModa_400Regular_Italic, BodoniModa_500Medium, BodoniModa_600SemiBold } from '@expo-google-fonts/bodoni-moda';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Nav() {
  const { c, f, dark } = useTheme();
  const { t } = useT();
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerShadowVisible: false,
          headerTintColor: c.fg,
          headerTitleStyle: { fontFamily: f.display, fontSize: 18, color: c.fg },
          headerTitleAlign: 'center',
          headerBackTitle: t('Geri'),
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="nedir" options={{ title: t('Persona nedir?'), presentation: 'modal' }} />
        <Stack.Screen name="ekle" options={{ title: t('Ekle'), presentation: 'modal' }} />
        <Stack.Screen name="persona/[id]" options={{ title: t('Dolap') }} />
        <Stack.Screen name="item/[id]" options={{ title: t('Parça') }} />
        <Stack.Screen name="marka/[id]" options={{ title: t('Marka') }} />
        <Stack.Screen name="defile/[id]" options={{ title: t('Defile') }} />
        <Stack.Screen name="stil/[id]" options={{ title: t('Stil') }} />
        <Stack.Screen name="liste/[id]" options={{ title: t('Liste') }} />
        <Stack.Screen name="user/[id]" options={{ title: t('Dolap') }} />
        <Stack.Screen name="review/[id]" options={{ title: t('Tartışma') }} />
        <Stack.Screen name="giris" options={{ title: t('Hesap') }} />
        <Stack.Screen name="gizlilik" options={{ title: t('Gizlilik') }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ BodoniModa_400Regular, BodoniModa_400Regular_Italic, BodoniModa_500Medium, BodoniModa_600SemiBold, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync().catch(() => {}); }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Nav />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
