import { useNavigation } from "@react-navigation/native"
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { TextInput } from "react-native-gesture-handler"
import { useForm } from "@tanstack/react-form"
import { Image } from "expo-image"

import { supabase } from "../lib/supabase"

export default function SignUpScreen() {
  const navigation = useNavigation()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        alert("Las contraseñas no coinciden")
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
      })

      if (error) {
        console.error("Error signing up:", error.message)
        alert("Error al registrarse: " + error.message)
      } else {
        console.log("Sign up successful:", data)
        alert("Registro exitoso. Revisa tu email para confirmar tu cuenta.")
        navigation.navigate("SignIn" as never)
      }
    },
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#effcf3" }}>
      <StatusBar
        style="dark"
        backgroundColor="#effcf3"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 50 }}>
            <Image
              source={require("../assets/LogoHorizontalPng.png")}
              style={{ width: 200, height: 60 }}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#16a34a" }}>Crear Cuenta</Text>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 30 }}>Regístrate para comenzar</Text>
          </View>

          <form.Field name="email">
            {(field) => (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>Email</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: "#fff",
                  }}
                  placeholder="tu@email.com"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>Contraseña</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Tu contraseña"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  secureTextEntry
                />
              </View>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" }}>
                  Confirmar Contraseña
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Confirma tu contraseña"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  secureTextEntry
                />
              </View>
            )}
          </form.Field>

          <TouchableOpacity
            style={{
              backgroundColor: "#16a34a",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={form.handleSubmit}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => navigation.navigate("SignIn" as never)}
          >
            <Text style={{ color: "#16a34a", fontSize: 16 }}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
