import "react-native-get-random-values"
import { Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"
import * as PIEXIF from "piexifjs"

export interface GPSCoordinates {
  lat: number
  lng: number
  date?: string | null
}

/**
 * Extrae coordenadas GPS de los datos EXIF de una imagen
 */
export const extractGPSFromExif = async (imageUri: string): Promise<GPSCoordinates | null> => {
  try {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      console.warn("Crypto API not available, skipping EXIF extraction")
      return null
    }

    // Verificar que el URI es válido
    if (
      !imageUri ||
      (!imageUri.startsWith("file://") && !imageUri.startsWith("content://") && !imageUri.startsWith("ph://"))
    ) {
      console.log("Invalid URI for EXIF extraction:", imageUri)
      return null
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    if (!base64) {
      console.log("Failed to read image as base64")
      return null
    }

    const dataUrl = `data:image/jpeg;base64,${base64}`
    const exifDict = PIEXIF.load(dataUrl)

    console.log("EXIF Data:", exifDict)

    // Extraer fecha de los datos EXIF
    let dateTime: string | null = null

    // Intentar obtener la fecha de diferentes campos EXIF
    if (exifDict.Exif && exifDict.Exif[PIEXIF.ExifIFD.DateTimeOriginal]) {
      dateTime = exifDict.Exif[PIEXIF.ExifIFD.DateTimeOriginal]
    } else if (exifDict.Exif && exifDict.Exif[306]) {
      // DateTime en Exif
      dateTime = exifDict.Exif[306]
    } else if (exifDict["0th"] && exifDict["0th"][PIEXIF.ImageIFD.DateTime]) {
      dateTime = exifDict["0th"][PIEXIF.ImageIFD.DateTime]
    }

    console.log("Extracted DateTime:", dateTime)

    if (exifDict.GPS && Object.keys(exifDict.GPS).length > 0) {
      const lat = exifDict.GPS[PIEXIF.GPSIFD.GPSLatitude]
      const latRef = exifDict.GPS[PIEXIF.GPSIFD.GPSLatitudeRef]
      const lng = exifDict.GPS[PIEXIF.GPSIFD.GPSLongitude]
      const lngRef = exifDict.GPS[PIEXIF.GPSIFD.GPSLongitudeRef]

      console.log("GPS Components:", { lat, latRef, lng, lngRef })

      if (lat && lng && latRef && lngRef && lat.length >= 3 && lng.length >= 3) {
        const isValidCoordinate = (coord: any[]) => {
          return coord.every((item) => {
            if (!Array.isArray(item) || item.length < 2) return false
            if (item[1] === 0) return false
            return true
          })
        }

        if (isValidCoordinate(lat) && isValidCoordinate(lng)) {
          try {
            const latitude = lat[0][0] / lat[0][1] + lat[1][0] / lat[1][1] / 60 + lat[2][0] / lat[2][1] / 3600
            const longitude = lng[0][0] / lng[0][1] + lng[1][0] / lng[1][1] / 60 + lng[2][0] / lng[2][1] / 3600

            const result = {
              lat: latRef === "S" ? -latitude : latitude,
              lng: lngRef === "W" ? -longitude : longitude,
              date: dateTime,
            }

            console.log("Extracted GPS coordinates and date:", result)
            return result
          } catch (calcError) {
            console.log("Error calculating coordinates:", calcError)
          }
        } else {
          console.log("Invalid coordinate structure")
        }
      } else {
        console.log("Missing or incomplete GPS data")
      }
    } else {
      console.log("No GPS data found in EXIF")
    }
  } catch (error) {
    console.log("Error extracting GPS data:", error)
  }
  return null
}

/**
 * Obtiene información del asset original en iOS a través de MediaLibrary
 */
export const getOriginalAssetInfo = async (asset: ImagePicker.ImagePickerAsset): Promise<string> => {
  try {
    // En iOS, intentamos obtener el asset original de MediaLibrary
    if (Platform.OS === "ios") {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
      if (mediaLibraryPermission.granted) {
        // Obtener assets recientes que podrían coincidir
        const recentAssets = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          first: 50, // Buscar en las 50 fotos más recientes
          sortBy: "creationTime",
        })

        const foundAsset = recentAssets.assets.find((mediaAsset) => {
          // Comparar por dimensiones y fecha aproximada
          const dimensionsMatch = mediaAsset.width === asset.width && mediaAsset.height === asset.height
          const timeMatch = asset.exif?.DateTime
            ? Math.abs(mediaAsset.creationTime - new Date(asset.exif.DateTime).getTime()) < 300000 // 5 minutos
            : true
          return dimensionsMatch && timeMatch
        })

        if (foundAsset) {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(foundAsset)
          console.log("Found original asset:", assetInfo)
          return assetInfo.localUri || assetInfo.uri
        }
      }
    }
  } catch (error) {
    console.log("Error getting original asset:", error)
  }
  return asset.uri
}

/**
 * Extrae coordenadas GPS de un asset de ImagePicker
 * Usa múltiples estrategias para iOS y una estrategia directa para Android
 */
export const extractGPSFromImagePicker = async (
  asset: ImagePicker.ImagePickerAsset
): Promise<GPSCoordinates | null> => {
  console.log("Extracting GPS from ImagePicker asset...")

  if (Platform.OS === "ios") {
    // Estrategia 1: Usar los datos GPS directamente del EXIF devuelto por ImagePicker
    if (asset.exif && asset.exif.GPS) {
      const gpsData = asset.exif.GPS
      console.log("GPS from ImagePicker EXIF:", gpsData)

      // Extraer coordenadas si están disponibles
      if (gpsData.Latitude && gpsData.Longitude) {
        // También intentar extraer la fecha del EXIF del asset
        let dateTime: string | null = null
        if (asset.exif?.DateTimeOriginal) {
          dateTime = asset.exif.DateTimeOriginal
        } else if (asset.exif?.DateTime) {
          dateTime = asset.exif.DateTime
        }

        const coords = {
          lat: gpsData.LatitudeRef === "S" ? -gpsData.Latitude : gpsData.Latitude,
          lng: gpsData.LongitudeRef === "W" ? -gpsData.Longitude : gpsData.Longitude,
          date: dateTime,
        }
        console.log("Using GPS and date from ImagePicker:", coords)
        return coords
      }
    }

    console.log("No GPS in ImagePicker EXIF, trying original asset...")

    // Estrategia 2: Buscar el asset original en MediaLibrary y extraer EXIF de ahí
    const originalUri = await getOriginalAssetInfo(asset)
    console.log("Original URI:", originalUri)
    const gps = await extractGPSFromExif(originalUri)

    if (gps) {
      console.log("GPS found in original asset:", gps)
      return gps
    }

    console.log("No GPS in original asset, trying fallback...")

    // Estrategia 3: Como último recurso, intentar con el URI devuelto por ImagePicker
    const fallbackGps = await extractGPSFromExif(asset.uri)
    if (fallbackGps) {
      console.log("GPS found in fallback:", fallbackGps)
      return fallbackGps
    }

    console.log("No GPS data found in any iOS source")
    return null
  } else {
    // Android: Extraer GPS directamente del archivo
    console.log("Extracting GPS from Android asset...")
    const gps = await extractGPSFromExif(asset.uri)
    if (gps) {
      console.log("GPS found in Android asset:", gps)
      return gps
    }

    console.log("No GPS data found in Android asset")
    return null
  }
}

/**
 * Extrae coordenadas GPS y fecha de un documento seleccionado (para Android)
 */
export const extractGPSFromDocument = async (documentUri: string): Promise<GPSCoordinates | null> => {
  console.log("Extracting GPS and date from document...")
  const gpsData = await extractGPSFromExif(documentUri)
  if (gpsData) {
    console.log("GPS and date found in document:", gpsData)
    return gpsData
  }

  console.log("No GPS data found in document")
  return null
}
