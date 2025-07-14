import * as ImagePicker from "expo-image-picker"

export const pickImage = async ({
  setError,
  setImage,
  setImageBase64,
}: {
  setError: (error: string | null) => void
  setImage: (image: string | null) => void
  setImageBase64: (base64: string | null) => void
}) => {
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
