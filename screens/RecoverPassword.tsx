import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { Image } from "expo-image"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import React, { useState, useEffect, useCallback } from "react"
import * as Linking from "expo-linking"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { EyeIcon, LockPasswordIcon, Mail01Icon, ViewOffIcon } from "@hugeicons/core-free-icons"

import { supabase } from "lib/supabase"
import { RootStackNavigationProp } from "types/index"

export default function RecoverPassword() {
  const navigation = useNavigation<RootStackNavigationProp<"SignIn">>()
  const [isResetMode, setIsResetMode] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [pwVisible, setPwVisible] = useState(false)
  const [confirmPwVisible, setConfirmPwVisible] = useState(false)

  const handleDeepLink = useCallback(async (url: string) => {
    console.log("URL recibida:", url)

    try {
      let access_token = null
      let refresh_token = null
      let type = null

      if (url.includes("#")) {
        const parsedUrl = new URL(url)
        const fragment = parsedUrl.hash.substring(1)
        const params = new URLSearchParams(fragment)

        access_token = params.get("access_token")
        refresh_token = params.get("refresh_token")
        type = params.get("type")
      }

      if (!access_token && url.includes("?")) {
        const parsedUrl = new URL(url)
        const params = new URLSearchParams(parsedUrl.search)

        access_token = params.get("access_token")
        refresh_token = params.get("refresh_token")
        type = params.get("type")
      }

      console.log("Parámetros extraídos:", { access_token, refresh_token, type })

      if (type === "recovery" && access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error) {
          console.error("Error al establecer sesión:", error)
          Alert.alert("Error", "No se pudo validar el enlace de recuperación")
          return
        }

        console.log("Sesión establecida correctamente:", data)

        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        setIsResetMode(true)

        Alert.alert("Enlace válido", "Ahora puedes establecer tu nueva contraseña")
      } else {
        console.log("URL no contiene parámetros de recuperación válidos")
        if (url.includes("RecoverPassword")) {
          console.log("Navegando a RecoverPassword sin parámetros")
        }
      }
    } catch (error) {
      console.error("Error al procesar deep link:", error)
      if (url.includes("access_token") || url.includes("type=recovery")) {
        Alert.alert("Error", "El enlace de recuperación no es válido")
      }
    }
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event detected")
        setIsResetMode(true)
      } else if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user.email)
        if (accessToken || refreshToken) {
          setIsResetMode(true)
        }
      }
    })

    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        console.log("Initial URL:", initialUrl)
        handleDeepLink(initialUrl)
      }
    }

    getInitialURL()

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url)
      handleDeepLink(url)
    })

    return () => {
      subscription.unsubscribe()
      linkingSubscription?.remove()
    }
  }, [handleDeepLink, accessToken, refreshToken])

  useFocusEffect(
    useCallback(() => {
      const checkAuthState = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          console.log("Usuario autenticado detectado:", session.user.id)
          setIsResetMode(true)
        }
      }

      checkAuthState()
    }, [])
  )

  const requestForm = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(value.email, {
          redirectTo: "acuanet://RecoverPassword",
        })

        if (error) {
          Alert.alert("Error", "Error al enviar el email: " + error.message)
          return
        }

        Alert.alert(
          "Email enviado",
          "Te hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y haz clic en el enlace para continuar.",
          [{ text: "OK" }]
        )
      } catch (err) {
        Alert.alert("Error", "Ocurrió un error inesperado")
        console.error("Error al solicitar recuperación:", err)
      }
    },
  })

  const resetForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden")
        return
      }

      if (value.password.length < 6) {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          Alert.alert("Error", "Sesión no válida. Por favor, solicita un nuevo enlace de recuperación.")
          setIsResetMode(false)
          return
        }

        const { error } = await supabase.auth.updateUser({
          password: value.password,
        })

        if (error) {
          Alert.alert("Error", "Error al actualizar la contraseña: " + error.message)
          return
        }

        await supabase.auth.signOut()

        Alert.alert(
          "Contraseña actualizada",
          "Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsResetMode(false)
                navigation.navigate("SignIn")
              },
            },
          ]
        )
      } catch (err) {
        Alert.alert("Error", "Ocurrió un error inesperado")
        console.error("Error al resetear contraseña:", err)
      }
    },
  })

  const backToRequest = () => {
    setIsResetMode(false)
    setAccessToken(null)
    setRefreshToken(null)
    supabase.auth.signOut()
  }

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
              <View className="mt-7 flex-1 items-center px-6 py-8">
                <Image
                  style={{ width: 250, height: 70 }}
                  source={require("@assets/LogoHorizontalPng.png")}
                  className="mb-8"
                />

                <View className="mb-5 mt-20 items-center gap-2">
                  <Text className="text-center font-Inter-SemiBold text-4xl text-green-100">
                    {isResetMode ? "Nueva Contraseña" : "Recuperar Contraseña"}
                  </Text>
                  {isResetMode && (
                    <Text className="text-center font-Inter-Medium text-sm text-green-100">
                      Ingresa tu nueva contraseña
                    </Text>
                  )}
                </View>

                <View className="z-40 w-full gap-1 rounded-3xl p-4">
                  {!isResetMode ? (
                    // Formulario para solicitar recuperación
                    <>
                      <requestForm.Field
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
                          <View className="flex-col gap-2">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                              <HugeiconsIcon
                                icon={Mail01Icon}
                                size={24}
                                color="#000000"
                                strokeWidth={1.5}
                              />
                              <TextInput
                                className="h-12 flex-1 rounded-md font-Inter-Medium text-base text-emerald-900"
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
                                placeholderTextColor="#047857"
                              />
                            </View>
                            {field.state.meta.errors && (
                              <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                            )}
                          </View>
                        )}
                      </requestForm.Field>

                      <requestForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
                        {([canSubmit, isSubmitting, errors]) => {
                          const hasErrors = Object.keys(errors).length > 0
                          const isFormValid = canSubmit && !hasErrors

                          return (
                            <TouchableOpacity
                              onPress={requestForm.handleSubmit}
                              disabled={!isFormValid}
                              className={`w-full rounded-md border-2 border-[#83ffc5] p-2 ${
                                isFormValid ? "bg-emerald-500" : "bg-emerald-900 opacity-60"
                              }`}
                              style={{
                                minHeight: 30,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                className={`font-Inter-SemiBold text-xl ${
                                  isFormValid ? "text-green-950" : "text-green-100"
                                }`}
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {isSubmitting ? "Enviando..." : "Enviar enlace"}
                              </Text>
                            </TouchableOpacity>
                          )
                        }}
                      </requestForm.Subscribe>
                    </>
                  ) : (
                    // Formulario para resetear contraseña
                    <>
                      <resetForm.Field
                        name="password"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return "La contraseña es requerida"
                            if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
                            return undefined
                          },
                        }}
                      >
                        {(field) => (
                          <View className="flex-col gap-2">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                              <HugeiconsIcon
                                icon={LockPasswordIcon}
                                size={24}
                                color="#000000"
                                strokeWidth={1.5}
                              />
                              <TextInput
                                className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                                aria-label="input"
                                aria-labelledby="labelPassword"
                                secureTextEntry={!pwVisible}
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                returnKeyType="next"
                                autoCapitalize="none"
                                textAlignVertical="center"
                                autoComplete="password"
                                placeholder="Ingresa tu nueva contraseña"
                                placeholderTextColor="#047857"
                              />
                              <TouchableOpacity
                                onPress={() => setPwVisible(!pwVisible)}
                                className="ml-2"
                              >
                                <HugeiconsIcon
                                  icon={pwVisible ? ViewOffIcon : EyeIcon}
                                  size={24}
                                  color="#000000"
                                  strokeWidth={1.5}
                                />
                              </TouchableOpacity>
                            </View>
                            {field.state.meta.errors && (
                              <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                            )}
                          </View>
                        )}
                      </resetForm.Field>

                      <resetForm.Field
                        name="confirmPassword"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return "Confirma tu contraseña"
                            return undefined
                          },
                        }}
                      >
                        {(field) => (
                          <View className="flex-col gap-2">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                              <HugeiconsIcon
                                icon={LockPasswordIcon}
                                size={24}
                                color="#000000"
                                strokeWidth={1.5}
                              />
                              <TextInput
                                className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                                aria-label="input"
                                aria-labelledby="labelConfirmPassword"
                                secureTextEntry={!confirmPwVisible}
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                returnKeyType="done"
                                autoCapitalize="none"
                                textAlignVertical="center"
                                placeholder="Confirma tu nueva contraseña"
                                placeholderTextColor="#047857"
                              />
                              <TouchableOpacity
                                onPress={() => setConfirmPwVisible(!confirmPwVisible)}
                                className="ml-2"
                              >
                                <HugeiconsIcon
                                  icon={confirmPwVisible ? ViewOffIcon : EyeIcon}
                                  size={24}
                                  color="#000000"
                                  strokeWidth={1.5}
                                />
                              </TouchableOpacity>
                            </View>
                            {field.state.meta.errors && (
                              <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                            )}
                          </View>
                        )}
                      </resetForm.Field>

                      <resetForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
                        {([canSubmit, isSubmitting, errors]) => {
                          const hasErrors = Object.keys(errors).length > 0
                          const isFormValid = canSubmit && !hasErrors

                          return (
                            <TouchableOpacity
                              onPress={resetForm.handleSubmit}
                              disabled={!isFormValid}
                              className={`w-full rounded-md border-2 border-[#83ffc5] p-2 ${
                                isFormValid ? "bg-emerald-500" : "bg-emerald-900 opacity-60"
                              }`}
                              style={{
                                minHeight: 30,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                className={`font-Inter-SemiBold text-xl ${
                                  isFormValid ? "text-green-950" : "text-green-100"
                                }`}
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                              </Text>
                            </TouchableOpacity>
                          )
                        }}
                      </resetForm.Subscribe>

                      {/* Botón para volver al modo de solicitud */}
                      <TouchableOpacity
                        onPress={backToRequest}
                        className="mt-3 w-full rounded-md border-2 border-emerald-700 bg-emerald-200 p-2"
                        style={{
                          minHeight: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          className="font-Inter-Medium text-base text-emerald-700"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Solicitar nuevo enlace
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <View className="mt-4 flex-col items-center justify-center">
                  <Text className="text-center font-Inter-Medium text-sm text-green-100">
                    ¿Tienes problemas para recuperar la contraseña?{" "}
                  </Text>
                  <TouchableOpacity onPress={openInstagram}>
                    <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">
                      Mandanos un mensaje en Instagram
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </>
  )
}
