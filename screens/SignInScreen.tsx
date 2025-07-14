import { Text, TouchableOpacity, View, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { Image } from "expo-image"
import { useNavigation } from "@react-navigation/native"

import { supabase } from "lib/supabase"
import { RootStackNavigationProp } from "types/index"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { EyeIcon, LockPasswordIcon, Mail01Icon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export default function SignIn() {
  const navigation = useNavigation<RootStackNavigationProp<"SignIn">>()
  const [pwVisible, setPwVisible] = useState(false)
  const [focused, setFocused] = useState<"email" | "password" | null>(null)
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      })

      if (error) {
        Alert.alert("Error", "No se pudo iniciar sesión. Por favor, verifica tus credenciales.")
        return
      }
    },
  })
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
          <View className="mt-7 flex-1 items-center px-6 py-8">
            <Image
              style={{ width: 250, height: 70 }}
              source={require("@assets/LogoHorizontalPng.png")}
              className="mb-8"
            />

            <View className="mb-5 mt-20 items-center gap-2">
              <Text className="text-center font-Inter-SemiBold text-4xl text-green-100">Inicia sesión</Text>

              <View className="flex-row items-center justify-center">
                <Text className="text-center font-Inter-Medium text-sm text-green-100">¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">Crear cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="z-40 w-full gap-1 rounded-3xl p-4">
              <form.Field
                name="email"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) return "El email es requerido"
                    if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido"
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <View className="flex-col">
                    <View
                      className="flex-row items-center gap-2 rounded-full bg-green-100 px-2"
                      style={{
                        borderWidth: 2,
                        borderColor:
                          field.state.meta.errors.length > 0
                            ? "#ef4444"
                            : focused === "email"
                              ? "#10b981"
                              : "transparent",
                      }}
                    >
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={24}
                        color="#047857"
                        strokeWidth={1.5}
                      />
                      <TextInput
                        style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                        className="h-12 flex-1 rounded-md font-Inter-Medium text-base text-emerald-900"
                        aria-label="input"
                        aria-labelledby="labelEmail"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => {
                          setFocused(null)
                          field.handleBlur()
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                        returnKeyType="next"
                        autoComplete="email"
                        textAlignVertical="center"
                        placeholder="Ingresa tu email"
                        placeholderTextColor="#047857"
                      />
                    </View>
                    {field.state.meta.errors && (
                      <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) return "La contraseña es requerida"
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <View className="flex-col">
                    <View
                      className="flex-row items-center gap-2 rounded-full bg-green-100 px-2"
                      style={{
                        borderWidth: 2,
                        borderColor:
                          field.state.meta.errors.length > 0
                            ? "#ef4444"
                            : focused === "password"
                              ? "#10b981"
                              : "transparent",
                      }}
                    >
                      <HugeiconsIcon
                        icon={LockPasswordIcon}
                        size={24}
                        color="#047857"
                        strokeWidth={1.5}
                      />
                      <TextInput
                        style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                        className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                        aria-label="input"
                        aria-labelledby="labelPassword"
                        secureTextEntry={!pwVisible}
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setFocused("password")}
                        onBlur={() => {
                          setFocused(null)
                          field.handleBlur()
                        }}
                        returnKeyType="done"
                        textAlignVertical="center"
                        autoComplete="off"
                        placeholder="Ingresa tu contraseña"
                        placeholderTextColor="#047857"
                      />
                      <TouchableOpacity
                        onPress={() => setPwVisible(!pwVisible)}
                        className="ml-2"
                      >
                        <HugeiconsIcon
                          icon={pwVisible ? ViewOffIcon : EyeIcon}
                          size={24}
                          color="#047857"
                          strokeWidth={1.5}
                        />
                      </TouchableOpacity>
                    </View>
                    {field.state.meta.errors && (
                      <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <TouchableOpacity
                    onPress={form.handleSubmit}
                    disabled={!canSubmit}
                    className={`w-full rounded-md border border-[#83ffc5] p-2 ${
                      canSubmit ? "bg-emerald-500" : "bg-emerald-900 opacity-60"
                    }`}
                    style={{
                      minHeight: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      className={`font-Inter-SemiBold text-xl ${canSubmit ? "text-green-950" : "text-green-100"}`}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Text>
                  </TouchableOpacity>
                )}
              </form.Subscribe>
            </View>

            <View className="mt-5 items-center justify-center">
              <Text className="text-center font-Inter-Medium text-sm text-green-100">¿Has olvidado la contraseña?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("RecoverPassword")}>
                <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">Pincha Aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
