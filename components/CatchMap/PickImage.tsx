import { Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { extractGPSFromImagePicker, extractGPSFromDocument } from "../../lib/extractGPSCoordinates"

interface PickImageParams {
  images: string[]
  MAX_IMAGES: number
  resetImageData: () => void
  setImages: React.Dispatch<React.SetStateAction<string[]>>
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
  setImageDate: React.Dispatch<React.SetStateAction<string | null>>
}

export const pickImage = async ({
  images,
  MAX_IMAGES,
  resetImageData,
  setImages,
  setCoordinates,
  setImageDate,
}: PickImageParams): Promise<void> => {
  if (images.length >= MAX_IMAGES) return

  resetImageData()

  try {
    if (Platform.OS === "ios") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) return

      const remainingSlots = MAX_IMAGES - images.length
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        allowsEditing: false,
        selectionLimit: remainingSlots,
        allowsMultipleSelection: true,
        orderedSelection: true,
      })

      if (!result.canceled && result.assets) {
        const assetsToAdd = result.assets.slice(0, remainingSlots)
        const newImageUris = assetsToAdd.map((asset) => asset.uri)
        setImages((prev) => [...prev, ...newImageUris])

        if (assetsToAdd[0]) {
          const gpsData = await extractGPSFromImagePicker(assetsToAdd[0])
          if (gpsData) {
            setCoordinates({
              lat: gpsData.lat,
              lng: gpsData.lng,
            })
            setImageDate(gpsData.date || null)
          }
        }
      }
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
        multiple: true,
      })

      if (!result.canceled && result.assets) {
        const remainingSlots = MAX_IMAGES - images.length
        const assetsToAdd = result.assets.slice(0, remainingSlots)
        const newImageUris = assetsToAdd.map((asset) => asset.uri)
        setImages((prev) => [...prev, ...newImageUris])

        if (assetsToAdd[0]) {
          const gpsData = await extractGPSFromDocument(assetsToAdd[0].uri)
          if (gpsData) {
            setCoordinates({
              lat: gpsData.lat,
              lng: gpsData.lng,
            })
            setImageDate(gpsData.date || null)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error picking image:", error)
  }
}
