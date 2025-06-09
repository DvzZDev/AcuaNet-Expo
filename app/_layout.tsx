import "global.css"
import { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Stack, SplashScreen, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Image } from "react-native"
import { useFonts } from "expo-font"
import { ThemeProvider } from "../components/Theme/theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { supabase } from "lib/supabase"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter.ttf"),
    "Inter-Bold": require("../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Black": require("../assets/fonts/InterDisplay-Black.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Light": require("../assets/fonts/InterDisplay-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/InterDisplay-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/InterDisplay-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/InterDisplay-SemiBold.ttf"),
  })

  useEffect(() => {
    const checkSession = async () => {
      if (sessionChecked) return

      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error)
      }

      setIsLoading(false)
      setSessionChecked(true)
      console.log("Session check:", data.session)

      if (data.session === null && !router.canGoBack()) {
        router.replace("/auth/signIn")
      }
    }

    if (loaded || error) {
      checkSession()
    }
  }, [loaded, error, sessionChecked])

  useEffect(() => {
    if ((loaded || error) && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error, isLoading])

  if (!loaded && !error) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#f0fdf4",
                },
                headerShadowVisible: false,
                title: "",
                headerLeft: () => (
                  <Image
                    source={require("../assets/LogoBlack.png")}
                    style={{
                      width: 150,
                      height: 40,
                      marginLeft: 10,
                    }}
                  />
                ),
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="auth/signIn"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="embalse/[embalse]"
                options={{ headerShown: true }}
              />
            </Stack>
          </SafeAreaProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
