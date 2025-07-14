import { AppState } from "react-native"
import "react-native-url-polyfill/auto"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export const setupAuthListener = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session?.user?.id)

    if (event === "SIGNED_IN") {
      console.log("Usuario conectado:", session?.user?.email)
    } else if (event === "SIGNED_OUT") {
      console.log("Usuario desconectado")
    } else if (event === "PASSWORD_RECOVERY") {
      console.log("Recuperación de contraseña iniciada")
    }
  })
}

export const confirmEmailChange = async (token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email_change",
    })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error("Error confirmando cambio de email:", error)
    return { success: false, error: error.message }
  }
}

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "acuanet://RecoverPassword",
    })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Error enviando email de recuperación:", error)
    return { success: false, error: error.message }
  }
}

export const updateUserPassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Error actualizando contraseña:", error)
    return { success: false, error: error.message }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error)
    return { success: false, error: error.message }
  }
}

export const emailVerification = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc("check_profile_email_exists", {
    input_email: email,
  })

  if (error) {
    console.error("Error verificando email:", error)
    return false
  }

  return data === true
}
