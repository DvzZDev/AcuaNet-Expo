import { supabase } from "lib/supabase"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import { Image } from "expo-image"
import { useStore } from "../../store"

export default function Account() {
  const userId = useStore((state) => state.id)
  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bucketName = "accounts"

  useEffect(() => {
    // Ya no necesitamos fetchear la session aquí porque el userId viene del store
    if (!userId) {
      console.log("Waiting for user ID from store...")
      return
    }
    // El userId ya está disponible desde el store
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
      quality: 0.8,
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

      if (!image) throw new Error("No image selected")
      if (!imageBase64) throw new Error("No image data available")
      if (!userId) throw new Error("User ID is null")

      console.log("Starting upload for user:", userId)
      console.log("Image URI:", image)

      const fileExt = image.split(".").pop() || "png"
      const fileName = `${userId}/Avatar.${fileExt}`
      console.log("Uploading to:", fileName)

      const byteCharacters = atob(imageBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      console.log("File size:", byteArray.length, "bytes")

      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, byteArray, {
        upsert: true,
        contentType: `image/${fileExt}`,
      })

      if (error) throw error

      console.log("Imagen subida:", data)
      alert("Imagen subida con éxito!")
    } catch (e: any) {
      setError(e.message)
      console.error("Error al subir imagen:", e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text style={{ color: "red", marginBottom: 20 }}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Button
        title="Seleccionar imagen"
        onPress={pickImage}
      />

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="contain"
        />
      )}

      <Button
        title={uploading ? "Subiendo..." : "Subir imagen"}
        onPress={uploadImage}
        disabled={uploading || !image}
      />

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
})
