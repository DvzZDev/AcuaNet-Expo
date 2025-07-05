import { supabase } from "../lib/supabase"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import { Image } from "expo-image"
import { useStore } from "../store"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

export default function AccountScreen() {
  const userId = useStore((state) => state.id)
  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bucketName = "accounts"

  useEffect(() => {
    if (!userId) {
      console.log("Waiting for user ID from store...")
      return
    }
  }, [userId])

  const pickImage = async () => {
    setError(null)
    setImage(null)
    setImageBase64(null)

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      setError("Se necesitan permisos para acceder a la galería.")
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setImageBase64(result.assets[0].base64 || null)
    }
  }

  const uploadImage = async () => {
    try {
      setUploading(true)
      setError(null)

      if (!imageBase64) {
        setError("No hay imagen seleccionada.")
        return
      }

      if (!userId) {
        setError("Usuario no autenticado.")
        return
      }

      const fileExtension = "png"
      const fileName = `Avatar.${fileExtension}`
      const filePath = `${userId}/${fileName}`

      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, decode(imageBase64), {
        contentType: `image/${fileExtension}`,
        upsert: true,
      })

      if (error) {
        setError(`Error al subir la imagen: ${error.message}`)
        return
      }

      console.log("Imagen subida exitosamente:", data)
      setImage(null)
      setImageBase64(null)
    } catch (error) {
      console.error("Error:", error)
      setError("Error inesperado al subir la imagen.")
    } finally {
      setUploading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Reset navigation stack to go back to sign in
    console.log("User signed out")
  }

  function decode(base64: string) {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Mi Cuenta</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>

          {image && (
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>{image ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
          </TouchableOpacity>

          {image && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadImage}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>{uploading ? "Subiendo..." : "Subir Imagen"}</Text>
            </TouchableOpacity>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={signOut}
        >
          <Text style={styles.signOutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 30,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 15,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  signOutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
})
