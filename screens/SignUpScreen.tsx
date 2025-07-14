import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { emailVerification, supabase } from "../lib/supabase"
import { Image } from "expo-image"
import { Checkbox } from "expo-checkbox"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { EyeIcon, LockPasswordIcon, Mail01Icon, UserIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export default function SignUpScreen() {
  const navigation = useNavigation()
  const [pwVisible, setPwVisible] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      const emailDuplicate = await emailVerification(value.email)

      if (emailDuplicate) {
        alert("El email ya está en uso. Por favor, utiliza otro email.")
        return
      }

      if (!value.acceptTerms) {
        alert("Debes aceptar los términos y condiciones")
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          data: {
            name: value.name,
            lastName: value.lastName,
          },
        },
      })

      if (error) {
        console.error("Error al registrar:", error.message)
        alert("Error al registrar: " + error.message)
        return
      }

      console.log("Usuario registrado:", data.user)
      navigation.navigate("SignIn" as never)
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
                  <Text className="text-center font-Inter-SemiBold text-4xl text-green-100">Crea tu cuenta</Text>

                  <View className="flex-row items-center justify-center">
                    <Text className="text-center font-Inter-Medium text-sm text-green-100">
                      ¿Ya tienes una cuenta?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignIn" as never)}>
                      <Text className="font-Inter-Medium text-sm leading-relaxed text-emerald-300">Inicia sesión</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="z-40 w-full gap-1 rounded-3xl p-4">
                  <View className="flex w-full flex-row gap-2">
                    <form.Field
                      name="name"
                      validators={{
                        onChange: ({ value }) => (!value ? "El nombre es requerido" : undefined),
                      }}
                    >
                      {(field) => (
                        <View className="flex-1 flex-col gap-2">
                          <View className="h-12 flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                            <HugeiconsIcon
                              icon={UserIcon}
                              size={24}
                              color="#047857"
                              strokeWidth={1.5}
                            />
                            <TextInput
                              style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                              className="flex-1 rounded-md font-Inter-Medium text-base text-emerald-900"
                              aria-label="input"
                              aria-labelledby="labelName"
                              value={field.state.value}
                              onChangeText={field.handleChange}
                              onBlur={field.handleBlur}
                              returnKeyType="next"
                              textAlignVertical="center"
                              placeholder="Nombre"
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
                      name="lastName"
                      validators={{
                        onChange: ({ value }) => (!value ? "Los apellidos son requeridos" : undefined),
                      }}
                    >
                      {(field) => (
                        <View className="flex-1 flex-col gap-2">
                          <View className="flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                            <HugeiconsIcon
                              icon={UserIcon}
                              size={24}
                              color="#047857"
                              strokeWidth={1.5}
                            />
                            <TextInput
                              style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                              className="h-12 flex-1 rounded-md font-Inter-Medium text-base text-emerald-900"
                              aria-label="input"
                              aria-labelledby="labelLastName"
                              value={field.state.value}
                              onChangeText={field.handleChange}
                              onBlur={field.handleBlur}
                              returnKeyType="next"
                              textAlignVertical="center"
                              placeholder="Apellidos"
                              placeholderTextColor="#047857"
                            />
                          </View>
                          {field.state.meta.errors && (
                            <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                          )}
                        </View>
                      )}
                    </form.Field>
                  </View>

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
                  </form.Field>

                  <form.Field
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

                  <form.Field
                    name="acceptTerms"
                    validators={{
                      onChange: ({ value }) => (!value ? "Debes aceptar los términos y condiciones" : undefined),
                    }}
                  >
                    {(field) => (
                      <View className="flex-col gap-2">
                        <View className="flex-row items-center gap-2 rounded-full px-2">
                          <Checkbox
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                            color={field.state.value ? "lightgreen" : undefined}
                            aria-label="Checkbox for accepting terms and conditions"
                            style={{ borderRadius: 6, width: 24, height: 24, borderColor: "#d1fae5", borderWidth: 2 }}
                          />
                          <View className="flex-row items-center justify-center">
                            <Text className="font-Inter-Medium text-base text-emerald-100">Acepto los </Text>
                            <TouchableOpacity onPress={() => Linking.openURL("https://acuanet.com/terms")}>
                              <Text className="text-base text-emerald-300">términos y condiciones</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        {field.state.meta.errors && (
                          <Text className="px-4 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                        )}
                      </View>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
                    {([canSubmit, isSubmitting, errors]) => {
                      const hasErrors = Object.keys(errors).length > 0
                      const isFormValid = canSubmit && !hasErrors

                      return (
                        <TouchableOpacity
                          onPress={form.handleSubmit}
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
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                          </Text>
                        </TouchableOpacity>
                      )
                    }}
                  </form.Subscribe>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </>
  )
}
