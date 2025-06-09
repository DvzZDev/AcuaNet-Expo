import { Link, router, Stack } from "expo-router"
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { Checkbox } from "expo-checkbox"
import { useForm } from "@tanstack/react-form"
import { supabase } from "lib/supabase"
import { Image } from "expo-image"

export default function SignUp() {
  const form = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        alert("Las contraseñas no coinciden")
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
                  <Text className=" text-center font-Inter-SemiBold text-4xl text-green-100">Crea tu cuenta</Text>

                  <Text className="text-center font-Inter-Medium text-sm text-green-100">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      href="/auth/signIn"
                      push={true}
                      className="font-Inter-Medium text-sm leading-relaxed text-emerald-300"
                    >
                      Inicia sesión
                    </Link>
                  </Text>
                </View>

                <View className="z-40 w-full rounded-3xl bg-emerald-100 p-6">
                  <View className=" flex w-full flex-row gap-3">
                    <form.Field
                      name="name"
                      validators={{
                        onChange: ({ value }) => (!value ? "El nombre es requerido" : undefined),
                      }}
                    >
                      {(field) => (
                        <View className="flex-1">
                          <Text
                            className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                            aria-label="Label for Name"
                            nativeID="labelName"
                          >
                            Nombre
                          </Text>
                          <TextInput
                            className="text-emerlad-900 h-12 w-full rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base leading-[1.2rem]"
                            aria-label="input"
                            aria-labelledby="labelName"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
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
                        <View className="flex-1">
                          <Text
                            className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                            aria-label="Label for LastName"
                            nativeID="labelLastName"
                          >
                            Apellidos
                          </Text>
                          <TextInput
                            className="text-emerlad-900 h-12 w-full rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base leading-[1.2rem]"
                            aria-label="input"
                            aria-labelledby="labelLastName"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
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
                      <View className="">
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Email"
                          nativeID="labelEmail"
                        >
                          Email
                        </Text>
                        <TextInput
                          className="text-emerlad-900 h-12 w-full rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base leading-[1.2rem]"
                          aria-label="input"
                          aria-labelledby="labelEmail"
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
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
                        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <View className="">
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Password"
                          nativeID="labelPassword"
                        >
                          Contraseña
                        </Text>
                        <TextInput
                          className="text-emerlad-900 h-12 w-full rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base leading-[1.2rem]"
                          aria-label="input"
                          aria-labelledby="labelPassword"
                          secureTextEntry={true}
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
                        )}
                      </View>
                    )}
                  </form.Field>

                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChangeListenTo: ["password"],
                      onChange: ({ value, fieldApi }) => {
                        if (!value) return "Confirma tu contraseña"
                        if (value !== fieldApi.form.getFieldValue("password")) {
                          return "Las contraseñas no coinciden"
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <View className="">
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Confirm Password"
                          nativeID="labelConfirmPassword"
                        >
                          Repite la contraseña
                        </Text>
                        <TextInput
                          className="text-emerlad-900 h-12 w-full rounded-md bg-emerald-200 px-4 font-Inter-Medium text-base leading-[1.2rem]"
                          aria-label="input"
                          aria-labelledby="labelConfirmPassword"
                          secureTextEntry={true}
                          value={field.state.value}
                          onChangeText={field.handleChange}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <Text className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</Text>
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
                      <View>
                        <Text
                          className="mb-2 font-Inter-SemiBold text-base text-emerald-700"
                          aria-label="Label for Terms"
                          nativeID="labelTerms"
                        >
                          Aceptas los terminos y condiciones{" "}
                          <Link
                            href={"https://acuanet.com/terms"}
                            className="text-emerald-700"
                          >
                            <Text>(Ver Aqui)</Text>
                          </Link>
                        </Text>
                        <View className="mt-2 flex-row items-center">
                          <Checkbox
                            className="h-6 w-6 rounded-md border-2 border-green-900 bg-emerald-200 p-1"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            color={field.state.value ? "#a5d5a8" : undefined}
                            aria-label="Checkbox for accepting terms and conditions"
                          />
                        </View>
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
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </form.Subscribe>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  )
}
