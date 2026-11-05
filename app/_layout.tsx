import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, BodoniModa_400Regular, BodoniModa_400Regular_Italic, BodoniModa_500Medium, BodoniModa_600SemiBold } from '@expo-google-fonts/bodoni-moda';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@/store';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Nav() {
  const { c, f, dark } = useTheme();
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
          headerBackTitle: 'Geri',
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="nedir" options={{ title: 'Persona nedir?', presentation: 'modal' }} />
        <Stack.Screen name="ekle" options={{ title: 'Ekle', presentation: 'modal' }} />
        <Stack.Screen name="persona/[id]" options={{ title: 'Dolap' }} />
        <Stack.Screen name="item/[id]" options={{ title: 'Parça' }} />
        <Stack.Screen name="marka/[id]" options={{ title: 'Marka' }} />
        <Stack.Screen name="defile/[id]" options={{ title: 'Defile' }} />
        <Stack.Screen name="stil/[id]" options={{ title: 'Stil' }} />
        <Stack.Screen name="liste/[id]" options={{ title: 'Liste' }} />
        <Stack.Screen name="user/[id]" options={{ title: 'Dolap' }} />
        <Stack.Screen name="review/[id]" options={{ title: 'Tartışma' }} />
        <Stack.Screen name="giris" options={{ title: 'Hesap' }} />
        <Stack.Screen name="gizlilik" options={{ title: 'Gizlilik' }} />
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
