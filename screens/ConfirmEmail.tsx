import { Image } from "expo-image"
import { StatusBar } from "expo-status-bar"
import { TouchableOpacity, View, Text, ActivityIndicator, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { ScrollView } from "react-native-gesture-handler"
import { useState, useEffect } from "react"
import { supabase } from "lib/supabase"
import { useStore } from "store"
import LottieView from "lottie-react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { useQueryClient } from "@tanstack/react-query"

export default function ConfirmEmail() {
  const navigation = useNavigation()
  const newEmail = useStore((state) => state.newEmail)
  const userId = useStore((state) => state.id)
  const [loading, setLoading] = useState(true)
  const [isChanged, setIsChanged] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("email").eq("email", newEmail).single()
        if (error) {
          setError(error.message)
          setIsChanged(false)
        } else if (data) {
          setIsChanged(true)
          setError(null)
        } else {
          setIsChanged(false)
          setError(null)
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido")
        setIsChanged(false)
      }
      setLoading(false)
    }

    const timer = setTimeout(() => {
      confirmEmail()
    }, 1500)

    return () => clearTimeout(timer)
  }, [newEmail])

  const openInstagram = async () => {
    const appUrl = "instagram://user?username=acuanet.es"
    const webUrl = "https://www.instagram.com/acuanet.es/"

    try {
      const supported = await Linking.canOpenURL(appUrl)
      if (supported) {
        await Linking.openURL(appUrl)
      } else {
        await Linking.openURL(webUrl)
      }
    } catch (error) {
      console.error("Error al abrir Instagram:", error)
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1">
        <SafeAreaView
          edges={["top"]}
          className="bg-[#16151a]"
        />
        <View
          className="absolute right-0 top-0 z-10 ml-2"
          pointerEvents="none"
        >
          <Image
            style={{ width: 550, height: 1000 }}
            className="absolute right-0 top-0 z-10"
            source={require("@assets/Star.png")}
          />
        </View>

        <View className="flex-1 bg-[#14141c]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="mt-7 flex-1 items-center px-6 py-8">
              <Image
                style={{ width: 250, height: 70 }}
                source={require("@assets/LogoHorizontalPng.png")}
                className="mb-8"
              />
              <View className="mb-5 mt-20 items-center gap-2">
                <Text className="text-center font-Inter-SemiBold text-4xl text-green-100">Confirmando tu email</Text>
              </View>

              <View className="h-48 items-center justify-center">
                {loading && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="items-center justify-center"
                  >
                    <ActivityIndicator
                      size={60}
                      color={"#007857"}
                    />
                  </Animated.View>
                )}
                {!loading && error && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="items-center justify-center"
                  >
                    <LottieView
                      source={require("@assets/animations/Error.json")}
                      autoPlay
                      loop={true}
                      style={{ width: 100, height: 100 }}
                    />
                    <Text className="text-center text-lg text-red-500">Ha sucedido un error en cambio</Text>
                  </Animated.View>
                )}
                {!loading && !error && (
                  <>
                    {isChanged ? (
                      <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="items-center justify-center"
                      >
                        <LottieView
                          source={require("@assets/animations/Success.json")}
                          autoPlay
                          loop={false}
                          style={{ width: 100, height: 100 }}
                        />
                        <Text className="mb-4 text-center text-xl text-green-400">
                          ¡Email confirmado correctamente! 🎉
                        </Text>
                      </Animated.View>
                    ) : (
                      <Text className="text-center text-lg text-gray-300">
                        Por favor, revisa tu correo y confirma el nuevo email.
                      </Text>
                    )}
                  </>
                )}
              </View>
              <View className="mt-4 flex-col items-center justify-center">
                <Text className="text-center font-Inter-Medium text-sm text-green-100">
                  ¿Tienes problemas para cambiar el mail?{" "}
                </Text>
                <TouchableOpacity onPress={openInstagram}>
                  <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">
                    Mandanos un mensaje en Instagram
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-7 rounded-full bg-emerald-700 px-6 py-3"
                  onPress={() => {
                    navigation.goBack()
                    queryClient.invalidateQueries({ queryKey: ["accountData", userId] })
                  }}
                >
                  <Text className="text-center font-Inter-SemiBold text-white">Volver a perfil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}
