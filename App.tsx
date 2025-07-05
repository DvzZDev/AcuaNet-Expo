import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { ThemeProvider } from "./components/Theme/theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { supabase } from "./lib/supabase"
import { useStore } from "./store"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { RootStackParamList } from "./types"
import "./global.css"

import SignInScreen from "./screens/SignInScreen"
import SignUpScreen from "./screens/SignUpScreen"
import TabNavigator from "./navigation/TabNavigator"
import EmbalseScreen from "./screens/EmbalseScreen"
import CatchReportScreen from "./screens/CatchReportScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
  const setId = useStore((state) => state.setId)
  const setAvatarUrl = useStore((state) => state.setAvatarUrl)
  console.log("is User signed", isUserSignedIn)

  const [loaded, error] = useFonts({
    Inter: require("./assets/fonts/Inter.ttf"),
    "Inter-Bold": require("./assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Black": require("./assets/fonts/InterDisplay-Black.ttf"),
    "Inter-ExtraBold": require("./assets/fonts/InterDisplay-ExtraBold.ttf"),
    "Inter-Light": require("./assets/fonts/InterDisplay-Light.ttf"),
    "Inter-Medium": require("./assets/fonts/InterDisplay-Medium.ttf"),
    "Inter-Regular": require("./assets/fonts/InterDisplay-Regular.ttf"),
    "Inter-SemiBold": require("./assets/fonts/InterDisplay-SemiBold.ttf"),
    "Inter-Black-Italic": require("./assets/fonts/Inter_BlackItalic.ttf"),
  })

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync()

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
        }

        if (data.session?.user?.id) {
          setId(data.session.user.id)
          setIsUserSignedIn(true)

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

          setInitialRoute("Tabs")
        } else {
          setInitialRoute("SignIn")
          setIsUserSignedIn(false)
        }
      } catch (err) {
        console.error("Error durante la comprobación de sesión:", err)
      } finally {
        setSessionChecked(true)
        SplashScreen.hideAsync()
      }
    }

    if ((loaded || error) && !sessionChecked) {
      prepareApp()
    }
  }, [loaded, error, sessionChecked, setId, setAvatarUrl])

  // useEffect(() => {
  //   if ((loaded || error) && !isLoading) {
  //     if (Platform.OS === "android") {
  //       NavigationBar.setPositionAsync("absolute")
  //       NavigationBar.setBackgroundColorAsync("#ffffff01")
  //       NavigationBar.setButtonStyleAsync("dark")
  //     }

  //     SplashScreen.hideAsync()
  //   }
  // }, [loaded, error, isLoading])

  if (!loaded && !error) {
    return null
  }

  // No renderizar hasta que se haya determinado la ruta inicial
  if (initialRoute === null) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <StatusBar style="dark" />
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName={initialRoute}
                  screenOptions={{
                    headerShown: false,
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
                    name="SignIn"
                    component={SignInScreen}
                  />
                  <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                  />
                  <Stack.Screen
                    name="Tabs"
                    component={TabNavigator}
                  />
                  <Stack.Screen
                    name="Embalse"
                    component={EmbalseScreen}
                    options={{
                      headerShown: true,
                      title: "",
                      headerTitleAlign: "left",
                      headerStyle: {
                        backgroundColor: "#effcf3",
                      },
                      headerBackVisible: true,
                      headerBackButtonDisplayMode: "minimal",
                      headerRight: () => null,
                      headerLeft: () => null,
                    }}
                  />
                  <Stack.Screen
                    name="CatchReport"
                    component={CatchReportScreen}
                    options={{
                      headerShown: true,
                      title: "",
                      headerTitleAlign: "left",
                      headerStyle: {
                        backgroundColor: "#effcf3",
                      },
                      headerBackVisible: true,
                      headerBackButtonDisplayMode: "minimal",
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaProvider>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
