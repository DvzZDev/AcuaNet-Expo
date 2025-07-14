import Apple from "@assets/icons/Apple"
import Google from "@assets/icons/Google"
import { Mail01Icon, MailAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import { View, Text, TouchableOpacity } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RootStackNavigationProp } from "types/index"

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<RootStackNavigationProp<"Welcome">>()

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/welcome.webp")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
        contentFit="cover"
      />
      <View
        style={{
          alignItems: "center",
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          zIndex: 55,
          height: "100%",
        }}
      >
        <View className="mt-16 items-center justify-center">
          <View className="h-32 w-32">
            <Image
              source={require("../assets/LogoE.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
              contentFit="contain"
            />
          </View>
          <Animated.Text
            entering={FadeIn}
            className="font-Black-Oblique text-[5rem] text-white"
          >
            Acua
            <Animated.Text
              entering={FadeIn.delay(500)}
              className="text-[#a5d5a8]"
            >
              Net
            </Animated.Text>
          </Animated.Text>

          <View className="mx-4 mt-3 w-[25rem] self-start overflow-hidden rounded-3xl p-1">
            <Text className="text-center font-Black-Rolmer text-[1.9rem] text-emerald-100">
              Planificar tus salidas de pesca y organizar tus capturas nunca fue tan fácil.
            </Text>
          </View>
        </View>

        <View className="mb-20 mt-auto">
          <TouchableOpacity className="mx-4 mt-3 w-[25rem] flex-row items-center justify-center gap-3 overflow-hidden rounded-3xl border border-green-400/40 bg-green-800/40 px-4 py-4">
            <Apple />
            <Text className="text-center font-Inter-Medium text-2xl text-green-50">Continuar con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mx-4 mt-3 w-[25rem] flex-row items-center justify-center gap-3 overflow-hidden rounded-3xl border border-green-400/40 bg-green-800/40 px-4 py-4">
            <Google />
            <Text className="text-center font-Inter-Medium text-2xl text-green-50">Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mx-4 mt-3 w-[25rem] flex-row items-center justify-center gap-3 overflow-hidden rounded-3xl border border-green-400/40 bg-green-800/40 px-4 py-4"
            onPress={() => navigation.navigate("SignIn")}
          >
            <HugeiconsIcon
              icon={Mail01Icon}
              size={30}
              color="red"
              strokeWidth={1.5}
            />
            <Text className="text-center font-Inter-Medium text-2xl text-green-50">Continuar Mail</Text>
          </TouchableOpacity>

          <View className="mt-3 flex-row items-center justify-center gap-4">
            <View className="h-[2px] w-[40%] bg-green-200" />
            <Text className="font-Inter-Medium text-xl text-green-100">o</Text>
            <View className="h-[2px] w-[40%] bg-green-200" />
          </View>

          <TouchableOpacity
            className="mx-4 mt-3 w-[25rem] flex-row items-center justify-center gap-3 overflow-hidden rounded-3xl border border-green-400/40 bg-green-800/40 px-4 py-4"
            onPress={() => navigation.navigate("SignUp")}
          >
            <HugeiconsIcon
              icon={MailAdd01Icon}
              size={24}
              color="lightgreen"
              strokeWidth={1.5}
            />
            <Text className="text-center font-Inter-Medium text-2xl text-green-50">Crear una Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
