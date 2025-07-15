import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { Image } from "expo-image"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import * as Linking from "expo-linking"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { EyeIcon, LockPasswordIcon, Mail01Icon, ViewOffIcon } from "@hugeicons/core-free-icons"

import { supabase } from "lib/supabase"
import { RootStackNavigationProp } from "types/index"
import { OtpInput } from "react-native-otp-entry"
import { useStore } from "store"

export default function RecoverPassword() {
  const navigation = useNavigation<RootStackNavigationProp<"SignIn">>()
  const [isResetMode, setIsResetMode] = useState(true)
  const [isOtpMode, setIsOtpMode] = useState(false)
  const [pwVisible, setPwVisible] = useState(false)
  const [confirmPwVisible, setConfirmPwVisible] = useState(false)
  const setIsRecoverySession = useStore((state) => state.setIsRecoverySession)
  const isRecoverySession = useStore((state) => state.isRecoverySession)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [cooldown])

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 20,
    },
    pinCodeContainer: {
      width: 45,
      height: 50,
      borderWidth: 2,
      borderColor: "#10b981",
      backgroundColor: "#d1fae5",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
    },
    pinCodeText: {
      fontSize: 20,
      fontWeight: "600",
      color: "#065f46", // emerald-800
      textAlign: "center",
    },
    focusStick: {
      backgroundColor: "#059669", // emerald-600
      height: 20,
      width: 2,
    },

    activePinCodeContainer: {
      borderColor: "#059669",
      backgroundColor: "#6ee7b7",
      boxShadow: "0 10px 15px rgba(5, 150, 105, 0.5)",
      borderWidth: 2,
      shadowColor: "#059669",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    placeholderText: {
      fontSize: 18,
      color: "#052e16",
      textAlign: "center",
      justifyContent: "center",
      lineHeight: 0,
    },
    filledPinCodeContainer: {},
  })

  const backToRequest = () => {
    supabase.auth.signOut()
    setIsResetMode(false)
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    })
  }

  const requestForm = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(value.email)

        if (error) {
          Alert.alert("Error", "Error al enviar el email: " + error.message)
          return
        }

        Alert.alert(
          "Email enviado",
          "Te hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y copia el código de recuperación.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsResetMode(false)
                setIsOtpMode(true)
              },
            },
          ]
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
        // Solo verificar sesión si NO estamos en recuperación
        if (!isRecoverySession) {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (!session) {
            Alert.alert("Error", "Sesión no válida. Por favor, solicita un nuevo enlace de recuperación.")
            setIsResetMode(false)
            return
          }
        }

        const { error } = await supabase.auth.updateUser({
          password: value.password,
        })

        if (error) {
          Alert.alert("Error", "Error al actualizar la contraseña: " + error.message)
          return
        }

        await supabase.auth.signOut()
        setIsRecoverySession(false)

        Alert.alert(
          "Contraseña actualizada",
          "Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsResetMode(false)
                backToRequest()
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

  const verifyOtp = async (otp: string) => {
    setIsRecoverySession(true)

    const { data, error } = await supabase.auth.verifyOtp({
      email: requestForm.state.values.email,
      token: otp,
      type: "recovery",
    })

    if (error) {
      Alert.alert("Error", "Error al verificar el código: " + error.message)
      return
    }

    Alert.alert(
      "Código verificado",
      "El código de recuperación ha sido verificado exitosamente. Ahora puedes cambiar tu contraseña.",
      [
        {
          text: "OK",
          onPress: async () => {
            setIsResetMode(false)
            setIsOtpMode(false)
          },
        },
      ]
    )

    console.log("OTP verification data:", data)
  }

  const resendOtp = async () => {
    if (cooldown > 0) return

    try {
      setCooldown(60)

      const { error } = await supabase.auth.resetPasswordForEmail(requestForm.state.values.email)

      if (error) {
        Alert.alert("Error", "Error al reenviar el código: " + error.message)
        return
      }

      Alert.alert("Código reenviado", "Te hemos enviado un nuevo código de recuperación a tu email.")
    } catch (err) {
      Alert.alert("Error", "Ocurrió un error inesperado")
      console.error("Error al reenviar OTP:", err)
    }
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
          className="x bg-[#16151a]"
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
                    {isResetMode ? "Escribe tu email" : isOtpMode ? "Introduce el código" : "Cambia la contraseña"}
                  </Text>
                </View>

                <View className="z-40 w-full gap-1 rounded-3xl p-4">
                  {isResetMode ? (
                    // Formulario para solicitar recuperación
                    <>
                      <requestForm.Field
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
                          <View className="flex-col gap-2">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
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
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                autoCorrect={false}
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
                              className={`w-full rounded-md border border-[#83ffc5] p-2 ${
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
                                {isSubmitting ? "Enviando..." : "Enviar código de recuperación"}
                              </Text>
                            </TouchableOpacity>
                          )
                        }}
                      </requestForm.Subscribe>
                    </>
                  ) : isOtpMode ? (
                    <>
                      <OtpInput
                        numberOfDigits={6}
                        autoFocus={false}
                        blurOnFilled={true}
                        disabled={false}
                        placeholder="******"
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFilled={(code) => verifyOtp(code)}
                        textInputProps={{
                          accessibilityLabel: "One-Time Password",
                        }}
                        textProps={{
                          accessibilityRole: "text",
                          accessibilityLabel: "OTP digit",
                          allowFontScaling: false,
                        }}
                        theme={{
                          containerStyle: styles.container,
                          pinCodeContainerStyle: styles.pinCodeContainer,
                          pinCodeTextStyle: styles.pinCodeText,
                          focusStickStyle: styles.focusStick,
                          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                          placeholderTextStyle: styles.placeholderText,
                          filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                        }}
                      />
                      <TouchableOpacity
                        onPress={resendOtp}
                        disabled={cooldown > 0}
                        className={`w-full rounded-md border border-[#83ffc5] p-2 ${
                          cooldown > 0 ? "bg-emerald-800 opacity-70" : "bg-emerald-500"
                        }`}
                        style={{
                          minHeight: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          className={`font-Inter-SemiBold text-xl ${
                            cooldown > 0 ? "text-emerald-300" : "text-green-950"
                          }`}
                          style={{ textAlign: "center" }}
                        >
                          {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <resetForm.Field
                        name="password"
                        validators={{
                          onSubmit: ({ value }) => {
                            if (!value) return "La contraseña es requerida"
                            if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
                            return undefined
                          },
                        }}
                      >
                        {(field) => (
                          <View className="flex-col">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
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
                                  size={20}
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
                      </resetForm.Field>

                      <resetForm.Field
                        name="confirmPassword"
                        validators={{
                          onSubmit: ({ value }) => {
                            if (!value) return "Confirma tu contraseña"
                            return undefined
                          },
                        }}
                      >
                        {(field) => (
                          <View className="flex-col">
                            <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
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
                                  size={20}
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
                      </resetForm.Field>

                      <resetForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
                        {([canSubmit, isSubmitting, errors]) => {
                          const hasErrors = Object.keys(errors).length > 0
                          const isFormValid = canSubmit && !hasErrors

                          return (
                            <TouchableOpacity
                              onPress={resetForm.handleSubmit}
                              disabled={!isFormValid}
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
