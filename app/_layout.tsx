import "global.css"
import { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Stack, SplashScreen, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Image } from "expo-image"
import { useFonts } from "expo-font"
import { ThemeProvider } from "../components/Theme/theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { supabase } from "lib/supabase"
import { useStore } from "../store"
import { Platform } from "react-native"
import * as NavigationBar from "expo-navigation-bar"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const queryClient = new QueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)
  const setId = useStore((state) => state.setId)
  const setAvatarUrl = useStore((state) => state.setAvatarUrl)

  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter.ttf"),
    "Inter-Bold": require("../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Black": require("../assets/fonts/InterDisplay-Black.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/InterDisplay-ExtraBold.ttf"),
    "Inter-Light": require("../assets/fonts/InterDisplay-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/InterDisplay-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/InterDisplay-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/InterDisplay-SemiBold.ttf"),
    "Inter-Black-Italic": require("../assets/fonts/Inter_BlackItalic.ttf"),
  })

  useEffect(() => {
    const checkSession = async () => {
      if (sessionChecked) return

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
        }

        if (data.session?.user?.id) {
          setId(data.session.user.id)

          const filePath = `${data.session.user.id}/Avatar.png`
          const { data: Davatar, error: Eavatar } = await supabase.storage
            .from("accounts")
            .createSignedUrl(filePath, 3600)

          if (Eavatar || !Davatar?.signedUrl) {
            console.log("Usuario sin foto de perfil o error al obtenerla:", Eavatar?.message)
            setAvatarUrl(null)
          } else {
            setAvatarUrl(Davatar.signedUrl)
          }
        }

        setSessionChecked(true)
        setIsLoading(false)

        if (data.session === null && !router.canGoBack()) {
          router.replace("/auth/signIn")
        }
      } catch (err) {
        console.error("Error durante la comprobación de sesión:", err)
        setSessionChecked(true)
        setIsLoading(false)
      }
    }

    if (loaded || error) {
      checkSession()
    }
  }, [loaded, error, sessionChecked, setId, setAvatarUrl])

  useEffect(() => {
    if ((loaded || error) && !isLoading) {
      if (Platform.OS === "android") {
        NavigationBar.setPositionAsync("absolute")
        NavigationBar.setBackgroundColorAsync("#ffffff01")
        NavigationBar.setButtonStyleAsync("dark")
      }
      SplashScreen.hideAsync()
    }
  }, [loaded, error, isLoading])

  if (!loaded && !error) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>C
          <ThemeProvider>
            <SafeAreaProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#f0fdf4",
                  },
                  headerTitleStyle: {
                    fontFamily: "Inter-Bold",
                  },
                  headerShadowVisible: false,
                  title: "Acua",
                }}
              >
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/signIn"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/signUp"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="embalse/[embalse]"
                  options={{
                    headerShown: true,
                    title: "",
                    headerTitleAlign: "left",
                    headerStyle: {
                      backgroundColor: "#effcf3",
                    },
                    headerBackVisible: true,
                    headerBackButtonDisplayMode: "minimal",
                    headerRight: () => "",
                    headerLeft: () => null,
                  }}
                />
              </Stack>
            </SafeAreaProvider>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
