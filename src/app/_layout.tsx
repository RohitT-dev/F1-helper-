import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SelectionProvider } from '../state/selection';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Requiring the .ttf files directly bundles only the five weights used. Importing
// from the font packages' index would ship every weight of both families.
const FONT_FILES = {
  BigShouldersDisplay_700Bold: require('@expo-google-fonts/big-shoulders-display/BigShouldersDisplay_700Bold.ttf'),
  BigShouldersDisplay_800ExtraBold: require('@expo-google-fonts/big-shoulders-display/BigShouldersDisplay_800ExtraBold.ttf'),
  HankenGrotesk_400Regular: require('@expo-google-fonts/hanken-grotesk/400Regular/HankenGrotesk_400Regular.ttf'),
  HankenGrotesk_500Medium: require('@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf'),
  HankenGrotesk_600SemiBold: require('@expo-google-fonts/hanken-grotesk/600SemiBold/HankenGrotesk_600SemiBold.ttf'),
};

export default function RootLayout() {
  const [loaded, error] = useFonts(FONT_FILES);

  useEffect(() => {
    // If a font fails to load the app still opens, with system fonts.
    if (loaded || error) SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SelectionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </SelectionProvider>
  );
}
