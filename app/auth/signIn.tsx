import { Link, router, Stack } from "expo-router"
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { Image } from "expo-image"

import { supabase } from "lib/supabase"
// import Google from "@assets/icons/google"
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"

export default function SignIn() {
  // GoogleSignin.configure({
  //   scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  //   webClientId: "758524626613-b6ejefvee8qjc9l2idg72lo3fm1n87g5.apps.googleusercontent.com",
  // })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      })

      if (error) {
        console.error("Error al iniciar sesión:", error.message)
        alert("Error al iniciar sesión: " + error.message)
        return
      }

      console.log("Usuario logueado:", data.user)
      router.replace("/")
    },
  })

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
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

        <SafeAreaView
          className="flex-1 bg-[#14141c]"
          edges={["left", "right"]}
        >
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 20}
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 items-center justify-center px-6 py-8">
                <Image
                  style={{ width: 250, height: 70 }}
                  source={require("@assets/LogoHorizontalPng.png")}
                  className="mb-8"
                />

                <View className="mb-8 items-center gap-2">
                  <Text className=" text-center font-Inter-SemiBold text-4xl text-green-100">Inicia sesión</Text>

                  <Text className="text-center font-Inter-Medium text-sm text-green-100">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      href="/auth/signUp"
                      push={true}
                      className="font-Inter-Medium text-sm leading-relaxed text-emerald-300"
                    >
                      Crear cuenta
                    </Link>
                  </Text>
                </View>

                <View className="z-40 w-full rounded-3xl bg-emerald-100 p-6">
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "El email es requerido"
                        if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido"
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <View className="mb-4">
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Email"
                          nativeID="labelEmail"
                        >
                          Email
                        </Text>
                        <TextInput
                          className="h-12 w-full leading-[1.2rem] rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base text-emerald-900"
                          aria-label="input"
                          aria-labelledby="labelEmail"
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          returnKeyType="next"
                          autoComplete="email"
                          textAlignVertical="center"
                          placeholder="Ingresa tu email"
                          placeholderTextColor="#6b7280"
                        />
                        {field.state.meta.errors && (
                          <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                        )}
                      </View>
                    )}
                  </form.Field>

                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "La contraseña es requerida"
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <View className="mb-6">
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Password"
                          nativeID="labelPassword"
                        >
                          Contraseña
                        </Text>
                        <TextInput
                          className="h-12 w-full rounded-md leading-[1.2rem] bg-emerald-200 px-4 font-Inter-Medium text-base text-emerald-900"
                          aria-label="input"
                          aria-labelledby="labelPassword"
                          secureTextEntry={true}
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          returnKeyType="done"
                          textAlignVertical="center"
                          autoComplete="off"
                          placeholder="Ingresa tu contraseña"
                          placeholderTextColor="#6b7280"
                        />
                        {field.state.meta.errors && (
                          <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                        )}
                      </View>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <TouchableOpacity
                        onPress={form.handleSubmit}
                        disabled={!canSubmit}
                        className={`border-1 h-14 w-full rounded-md border-[#83ffc5] ${
                          canSubmit ? "bg-[#25e089]" : "bg-gray-400 opacity-50"
                        }`}
                      >
                        <View className="flex-1 items-center justify-center">
                          <Text className="font-Inter-SemiBold text-xl text-green-950">
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </form.Subscribe>
                </View>

                {/* <TouchableOpacity
                  onPress={async () => {
                    console.log("Iniciando sesión con Google...")
                    try {
                      console.log("Verificando Play Services...")
                      await GoogleSignin.hasPlayServices()
                      console.log("Play Services disponibles")

                      console.log("Iniciando proceso de sign in...")
                      const userInfo = await GoogleSignin.signIn()
                      console.log("User Info:", userInfo)
                      console.log("User Info estructura completa:", JSON.stringify(userInfo, null, 2))

                      if (userInfo.data && userInfo.data.idToken) {
                        console.log("ID Token encontrado, enviando a Supabase...")
                        const { data, error } = await supabase.auth.signInWithIdToken({
                          provider: "google",
                          token: userInfo.data.idToken,
                        })

                        if (error) {
                          console.error("Error en Supabase:", error)
                          alert("Error al iniciar sesión con Google: " + error.message)
                        } else {
                          console.log("Éxito en Supabase:", data)
                          router.replace("/home")
                        }
                      } else {
                        console.error("No se encontró ID token en la respuesta")
                        console.log("Estructura de userInfo sin idToken:", JSON.stringify(userInfo, null, 2))
                        throw new Error("no ID token present!")
                      }
                    } catch (error: any) {
                      console.error("Error completo:", error)
                      console.error("Error code:", error.code)
                      console.error("Error message:", error.message)

                      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        console.log("Usuario canceló el login")
                      } else if (error.code === statusCodes.IN_PROGRESS) {
                        console.log("Operación ya en progreso")
                      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        console.log("Play Services no disponibles")
                        alert("Google Play Services no están disponibles")
                      } else {
                        console.log("Otro tipo de error:", error)
                        alert("Error al iniciar sesión con Google: " + (error.message || "Error desconocido"))
                      }
                    }
                  }}
                  className="my-6 w-full flex-row items-center justify-center gap-2 rounded-xl border border-[#a4fcc3] bg-green-200 p-2"
                >
                  <Google />
                  <Text className="font-Inter-Medium">Inicia con Google</Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  )
}
