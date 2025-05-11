import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';

import 'global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#effcf3" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#effcf3',
          },
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
        }}>
        <Slot />
      </Stack>
    </>
  );
}
