import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Image } from "expo-image"
import { useNavigation, useRoute } from "@react-navigation/native"
import { OtpInput } from "react-native-otp-entry"
import { useState, useEffect } from "react"

import { RootStackNavigationProp } from "types/index"
import { supabase } from "lib/supabase"

export default function ConfirmEmailsssss() {
  const route = useRoute()
  // Agrega verificación para route.params
  const params = route.params as { email?: string; returnTo?: string } | undefined
  const { email, returnTo } = params || {}

  const navigation = useNavigation<RootStackNavigationProp<"ConfirmEmail">>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log("email", email)

  // Verifica si hay email al cargar el componente
  useEffect(() => {
    if (!email) {
      console.error("No email provided to ConfirmEmail screen")
      // Opcionalmente, puedes mostrar un error o navegar de vuelta
      showErrorAlert("No se proporcionó un email válido. Por favor, inténtalo nuevamente.")
      // Navegar de vuelta después de un delay
      setTimeout(() => {
        navigation.goBack()
      }, 2000)
    }
  }, [email, navigation])

  const styles = {
    container: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 12,
      paddingHorizontal: 8,
    },

    pinCodeContainer: {
      width: 50,
      height: 60,
      backgroundColor: "#1f1f28",
      borderRadius: 12,
      borderWidth: 1.5,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    activePinCodeContainer: {
      backgroundColor: "#1a2e1d",
      borderColor: "#10b981",
      borderWidth: 2,
      shadowColor: "#10b981",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    focusedPinCodeContainer: {
      backgroundColor: "#1a2e1d",
      borderColor: "#34d399",
      borderWidth: 2,
      shadowColor: "#34d399",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
    },

    filledPinCodeContainer: {
      backgroundColor: "#0f2a14",
      borderColor: "#059669",
      borderWidth: 2,
    },

    disabledPinCodeContainer: {
      backgroundColor: "#1a1a20",
      borderColor: "#2a2a32",
      opacity: 0.6,
    },

    pinCodeText: {
      fontSize: 24,
      fontWeight: "600" as const,
      color: "#d1fae5",
      textAlign: "center" as const,
      fontFamily: "Inter-SemiBold",
    },

    placeholderText: {
      fontSize: 24,
      fontWeight: "400" as const,
      color: "#4b5563",
      textAlign: "center" as const,
      fontFamily: "Inter-Medium",
    },

    focusStick: {
      backgroundColor: "#10b981",
      width: 2,
      height: 20,
    },
  }

  const showErrorAlert = (message: string) => {
    Alert.alert("Error", message, [{ text: "Entendido", style: "cancel" }], { cancelable: true })
  }

  const showSuccessAlert = (message: string, onConfirm?: () => void) => {
    Alert.alert(
      "Éxito",
      message,
      [
        {
          text: "Continuar",
          style: "default",
          onPress: onConfirm,
        },
      ],
      { cancelable: false }
    )
  }

  const verifyEmailChange = async (otp: string, email: string) => {
    if (!email) {
      showErrorAlert("No se ha proporcionado un email válido")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Verifying email change OTP:", otp, "for new email:", email.trim())

      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: "email_change",
      })

      if (error) {
        console.error("Error verifying email change:", error.message)
        setError(error.message)

        // Mostrar mensaje de error más específico
        let errorMessage = "Error al verificar el código"
        if (error.message.includes("expired")) {
          errorMessage = "El código ha expirado. Solicita uno nuevo."
        } else if (error.message.includes("invalid")) {
          errorMessage = "El código ingresado no es válido."
        } else if (error.message.includes("used")) {
          errorMessage = "Este código ya ha sido utilizado."
        }

        showErrorAlert(errorMessage)
        return
      }

      if (data.user) {
        console.log("Email change confirmed successfully:", data)

        // Actualizar el email en la tabla profiles también
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ email: email.trim() })
          .eq("id", data.user.id)

        if (profileError) {
          console.error("Error updating profile email:", profileError)
          // No bloquear el flujo por este error, pero logearlo
        }

        // Mostrar mensaje de éxito y navegar
        showSuccessAlert("Email confirmado exitosamente. Tu nuevo email ha sido actualizado.", () => {
          // Navegar según el parámetro returnTo o por defecto a Account
          if (returnTo === "Account") {
            navigation.navigate("Account")
          } else {
            navigation.goBack()
          }
        })
      } else {
        console.log("Email change verification failed - no user data")
        showErrorAlert("Error al verificar el código. Inténtalo nuevamente.")
      }
    } catch (err) {
      console.error("Unexpected error during OTP verification:", err)
      showErrorAlert("Ocurrió un error inesperado. Inténtalo nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!email) {
      showErrorAlert("No se puede reenviar el código sin un email válido")
      return
    }

    try {
      setIsLoading(true)
      // Nota: Supabase no tiene un método directo para reenviar OTP de email change
      // El usuario tendría que volver a la pantalla de edición y cambiar el email nuevamente
      showErrorAlert(
        "Para recibir un nuevo código, regresa a la pantalla de edición de perfil y cambia tu email nuevamente."
      )
    } catch (err) {
      console.error("Error resending OTP:", err)
      showErrorAlert("Error al reenviar el código")
    } finally {
      setIsLoading(false)
    }
  }

  // Si no hay email, mostrar mensaje de error
  if (!email) {
    return (
      <>
        <StatusBar style="light" />
        <View className="flex-1">
          <SafeAreaView
            edges={["top"]}
            className="bg-[#16151a]"
          />
          <View className="flex-1 items-center justify-center bg-[#14141c] px-6">
            <Text className="mb-4 text-center font-Inter-SemiBold text-xl text-red-400">
              Error: No se proporcionó un email válido
            </Text>
            <Text className="mb-8 text-center font-Inter-Medium text-sm text-green-100/70">
              Por favor, vuelve a intentarlo desde la pantalla anterior.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="rounded-lg bg-emerald-600 px-6 py-3"
            >
              <Text className="font-Inter-SemiBold text-white">Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
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
                    Confirma tu nuevo email
                  </Text>

                  <Text className="text-center font-Inter-Medium text-sm text-green-100/70">
                    Ingresa el código de 6 dígitos que enviamos a:
                  </Text>

                  <Text className="text-center font-Inter-SemiBold text-sm text-emerald-300">{email}</Text>

                  <View className="mt-4 flex-row items-center justify-center">
                    <Text className="text-center font-Inter-Medium text-sm text-green-100">
                      ¿No tienes una cuenta?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                      <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">Crear cuenta</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="z-40 w-full gap-1 rounded-3xl p-4">
                  <OtpInput
                    numberOfDigits={6}
                    autoFocus={true}
                    blurOnFilled={true}
                    disabled={isLoading}
                    onFilled={(otp) => {
                      verifyEmailChange(otp, email)
                    }}
                    type="numeric"
                    focusStickBlinkingDuration={500}
                    onTextChange={(text) => {
                      // Limpiar error cuando el usuario empieza a escribir
                      if (error) {
                        setError(null)
                      }
                    }}
                    textInputProps={{
                      accessibilityLabel: "Código de verificación de email",
                    }}
                    textProps={{
                      accessibilityRole: "text",
                      accessibilityLabel: "Dígito del código OTP",
                      allowFontScaling: false,
                    }}
                    theme={{
                      containerStyle: styles.container,
                      pinCodeContainerStyle: styles.pinCodeContainer,
                      pinCodeTextStyle: styles.pinCodeText,
                      focusStickStyle: styles.focusStick,
                      focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
                      placeholderTextStyle: styles.placeholderText,
                      filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                      disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                    }}
                  />
                </View>

                {error && (
                  <View className="mt-4 rounded-lg bg-red-500/10 p-3">
                    <Text className="text-center font-Inter-Medium text-sm text-red-400">{error}</Text>
                  </View>
                )}

                <View className="mt-5 items-center justify-center">
                  <Text className="text-center font-Inter-Medium text-sm text-green-100">¿No recibiste el código?</Text>
                  <TouchableOpacity
                    onPress={resendOTP}
                    disabled={isLoading}
                    className={isLoading ? "opacity-50" : ""}
                  >
                    <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">
                      {isLoading ? "Procesando..." : "Reenviar código"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="mt-8 items-center justify-center">
                  <Text className="text-center font-Inter-Medium text-sm text-green-100">
                    ¿Has olvidado la contraseña?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("RecoverPassword")}>
                    <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">Pincha Aquí</Text>
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
