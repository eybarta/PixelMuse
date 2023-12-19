import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import SplashScreenVideo from '../components/SplashScreenVideo';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'home',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setReady] = useState(false);
  
  // Load fonts and assets.
  const [loaded, error] = useFonts({
    Rubik: Rubik_400Regular,
    RubikBold: Rubik_700Bold,
    ...FontAwesome.font,
  });
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !appReady) {
    return <SplashScreenVideo></SplashScreenVideo>
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.wrap}>
      <GestureHandlerRootView style={styles.wrap}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="home" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
    </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    display: 'flex',
    width: '100%',
    height: '100%'
  }
})