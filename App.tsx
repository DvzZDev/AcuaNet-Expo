import React, { useEffect, useState, useCallback } from "react"
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

import "./global.css"
import * as NavigationBar from "expo-navigation-bar"
import SignInScreen from "./screens/SignInScreen"
import SignUpScreen from "./screens/SignUpScreen"
import TabNavigator from "./navigation/TabNavigator"
import EmbalseScreen from "./screens/EmbalseScreen"
import CatchReportScreen from "./screens/CatchReportScreen"
import CatchGalleryScreen from "screens/CatchGalleryScreen"
import WelcomeScreen from "screens/WelcomeScreen"
import RecoverPassword from "screens/RecoverPassword"
import * as Linking from "expo-linking"
import ConfirmEmail from "screens/ConfirmEmail"
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { RootStackParamList } from "./types"

type AuthStackParamList = Pick<RootStackParamList, "Welcome" | "SignIn" | "SignUp" | "RecoverPassword" | "ConfirmEmail">

type AppStackParamList = Pick<RootStackParamList, "Tabs" | "Embalse" | "CatchReport" | "Gallery">

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()
const queryClient = new QueryClient()
const prefix = Linking.createURL("/")

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
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
      <AuthStack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
      />
      <AuthStack.Screen
        name="RecoverPassword"
        component={RecoverPassword}
      />
      <AuthStack.Screen
        name="ConfirmEmail"
        component={ConfirmEmail}
      />
    </AuthStack.Navigator>
  )
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      initialRouteName="Tabs"
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
      <AppStack.Screen
        name="Tabs"
        component={TabNavigator}
      />
      <AppStack.Screen
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
      <AppStack.Screen
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
      <AppStack.Screen
        name="Gallery"
        component={CatchGalleryScreen}
        options={{
          headerShown: true,
          title: "",
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "#effcf3",
          },
        }}
      />
    </AppStack.Navigator>
  )
}

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
  const [isNavigationReady, setIsNavigationReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const setId = useStore((state) => state.setId)
  const setAvatarUrl = useStore((state) => state.setAvatarUrl)
  const navigationRef = React.createRef<any>()

  const linking = {
    prefixes: [prefix, "acuanet://", "exp+acuanet://"],
    config: {
      screens: {
        Welcome: "welcome",
        SignIn: "signin",
        SignUp: "signup",
        RecoverPassword: {
          path: "recover-password",
          parse: {
            token: (token: any) => token,
          },
        },
        ConfirmEmail: {
          path: "confirm-email",
        },
        Tabs: {
          path: "tabs",
          screens: {
            Home: "home",
            Search: "search",
            CatchMap: "catch-map",
            Account: "account",
          },
        },
        Embalse: "embalse",
        CatchReport: "catch-report",
        Gallery: "gallery",
      },
    },
  }

  const handleSessionChange = useCallback(
    async (session: any) => {
      try {
        if (session?.user?.id) {
          setId(session.user.id)
          setIsUserSignedIn(true)

          const filePath = `${session.user.id}/Avatar.png`
          const { data: Davatar, error: Eavatar } = await supabase.storage
            .from("accounts")
            .createSignedUrl(filePath, 3600)

          if (Eavatar || !Davatar?.signedUrl) {
            setAvatarUrl(null)
          } else {
            setAvatarUrl(Davatar.signedUrl)
          }
        } else {
          setId(null)
          setAvatarUrl(null)
          setIsUserSignedIn(false)
        }
      } catch (error) {
        console.error("Error handling session change:", error)
      }
    },
    [setId, setAvatarUrl]
  )

  const handleDeepLink = (url: string) => {
    if (!url || !isNavigationReady || !navigationRef.current) {
      return
    }

    try {
      if (url.includes("type=email_change")) {
        navigationRef.current.navigate("ConfirmEmail")
      } else if (url.includes("type=")) {
        Alert.alert("Error", "Este enlace ya ha sido usado o ha ocurrido un error", [{ text: "OK" }])
      }
    } catch (error) {
      console.error("Error handling deep link:", error)
      Alert.alert("Error", "Ha ocurrido un error al procesar el enlace", [{ text: "OK" }])
    }
  }

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
    "Black-Rolmer": require("./assets/fonts/BlackRolmer-Regular.otf"),
    "Black-Oblique": require("./assets/fonts/BlackRolmer-Oblique.otf"),
  })

  useEffect(() => {
    let authListener: any

    const setupAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching initial session:", error)
        }

        await handleSessionChange(session)

        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN") {
            queryClient.invalidateQueries()
          } else if (event === "SIGNED_OUT") {
            queryClient.clear()
          }

          await handleSessionChange(session)
        })
      } catch (err) {
        console.error("Error setting up auth:", err)
      } finally {
        setIsLoading(false)
        setSessionChecked(true)
      }
    }

    if (loaded || error) {
      setupAuth()
    }

    return () => {
      authListener?.data?.subscription?.unsubscribe()
    }
  }, [loaded, error, handleSessionChange])

  useEffect(() => {
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        handleDeepLink(initialUrl)
      }
    }

    const linkingSubscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url)
    })

    if (isNavigationReady) {
      handleInitialURL()
    }

    return () => linkingSubscription?.remove()
  }, [isNavigationReady])

  useEffect(() => {
    if (sessionChecked && !isLoading) {
      const timeout = setTimeout(() => {
        NavigationBar.setPositionAsync("absolute")
        NavigationBar.setBackgroundColorAsync("#ffffff01")
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [sessionChecked, isLoading])

  useEffect(() => {
    const hideSplash = async () => {
      if (sessionChecked && !isLoading && (loaded || error)) {
        await SplashScreen.hideAsync()
      }
    }

    hideSplash()
  }, [sessionChecked, isLoading, loaded, error])

  if ((!loaded && !error) || isLoading || !sessionChecked) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <SafeAreaProvider>
                <StatusBar
                  style="auto"
                  translucent
                />
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  onReady={() => {
                    setIsNavigationReady(true)
                  }}
                >
                  {isUserSignedIn ? <AppNavigator /> : <AuthNavigator />}
                </NavigationContainer>
              </SafeAreaProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </QueryClientProvider>
  )
}
