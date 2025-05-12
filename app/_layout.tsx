import 'global.css';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '../components/Theme/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#f0fdf4" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerShadowVisible: false,
            title: '',
            headerLeft: () => (
              <Image
                source={require('../assets/LogoBlack.png')}
                style={{
                  width: 150,
                  height: 40,
                  marginLeft: 10,
                }}
              />
            ),
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="embalse/[embalse]" options={{ headerShown: true }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
