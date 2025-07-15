import React, { useEffect, useState, useCallback, useMemo } from "react"
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
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { RootStackParamList } from "./types"
import ConfirmEmail from "screens/ConfirmEmail"

const queryClient = new QueryClient()

type AuthStackParamList = Pick<RootStackParamList, "Welcome" | "SignIn" | "SignUp" | "RecoverPassword" | "ConfirmEmail">
type AppStackParamList = Pick<RootStackParamList, "Tabs" | "Embalse" | "CatchReport" | "Gallery">

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()

const AuthNavigator = React.memo(() => (
  <AuthStack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: "#f0fdf4" },
      headerTitleStyle: { fontFamily: "Inter-Bold" },
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
))

const AppNavigator = React.memo(() => (
  <AppStack.Navigator
    initialRouteName="Tabs"
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: "#f0fdf4" },
      headerTitleStyle: { fontFamily: "Inter-Bold" },
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
        headerStyle: { backgroundColor: "#effcf3" },
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
        headerStyle: { backgroundColor: "#effcf3" },
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
        headerStyle: { backgroundColor: "#effcf3" },
      }}
    />
  </AppStack.Navigator>
))

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
  const isRecoverySession = useStore((state) => state.isRecoverySession)

  console.log("recovery session:", isRecoverySession)

  const setId = useStore((state) => state.setId)
  const setAvatarUrl = useStore((state) => state.setAvatarUrl)

  const navigationRef = React.useRef<any>(null)

  const handleSessionChange = useCallback(
    async (session: any) => {
      if (!session?.user?.id) {
        setId(null)
        setAvatarUrl(null)
        setIsUserSignedIn(false)
        return
      }

      if (isRecoverySession) {
        return
      }

      setId(session.user.id)
      setIsUserSignedIn(true)

      try {
        const filePath = `${session.user.id}/Avatar.png`
        const { data: Davatar } = await supabase.storage.from("accounts").createSignedUrl(filePath, 3600)

        setAvatarUrl(Davatar?.signedUrl || null)
      } catch (error) {
        console.error("Avatar fetch error:", error)
        setAvatarUrl(null)
      }
    },
    [isRecoverySession, setId, setAvatarUrl]
  )

  const [fontsLoaded] = useFonts({
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
    let authSubscription: { unsubscribe: () => void } | null = null

    const initApp = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        await handleSessionChange(session)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN") queryClient.invalidateQueries()
          if (event === "SIGNED_OUT") queryClient.clear()
          handleSessionChange(session)
        })
        authSubscription = subscription
      } catch (error) {
        console.error("Init error:", error)
      } finally {
        setSessionChecked(true)
        setTimeout(() => SplashScreen.hideAsync(), 100)
      }
    }

    if (fontsLoaded) initApp()

    return () => authSubscription?.unsubscribe()
  }, [fontsLoaded, handleSessionChange])

  useEffect(() => {
    if (sessionChecked) {
      NavigationBar.setPositionAsync("absolute")
      NavigationBar.setBackgroundColorAsync("#ffffff01")
    }
  }, [sessionChecked])

  if (!fontsLoaded || !sessionChecked) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <SafeAreaProvider>
                <StatusBar
                  style="auto"
                  translucent
                />
                <NavigationContainer ref={navigationRef}>
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
