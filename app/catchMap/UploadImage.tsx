import { View, TouchableOpacity, Text, Platform } from "react-native"
import React, { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { ArrowRight02Icon, ExchangeIcon, ImageUploadIcon } from "@hugeicons/core-free-icons"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { Image } from "expo-image"
import * as FileSystem from "expo-file-system"
import * as PIEXIF from "piexifjs"
import MapView, { Marker } from "react-native-maps"

export default function UploadImage() {
  const [image, setImage] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [step, setStep] = useState(1)

  console.log(image)

  const extractGPSFromExif = async (imageUri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const dataUrl = `data:image/jpeg;base64,${base64}`
      const exifDict = PIEXIF.load(dataUrl)

      if (exifDict.GPS) {
        const lat = exifDict.GPS[PIEXIF.GPSIFD.GPSLatitude]
        const latRef = exifDict.GPS[PIEXIF.GPSIFD.GPSLatitudeRef]
        const lng = exifDict.GPS[PIEXIF.GPSIFD.GPSLongitude]
        const lngRef = exifDict.GPS[PIEXIF.GPSIFD.GPSLongitudeRef]

        if (lat && lng && latRef && lngRef) {
          const latitude = lat[0][0] / lat[0][1] + lat[1][0] / lat[1][1] / 60 + lat[2][0] / lat[2][1] / 3600
          const longitude = lng[0][0] / lng[0][1] + lng[1][0] / lng[1][1] / 60 + lng[2][0] / lng[2][1] / 3600

          return {
            lat: latRef === "S" ? -latitude : latitude,
            lng: lngRef === "W" ? -longitude : longitude,
          }
        }
      }
    } catch {
      console.log("No GPS data found")
    }
    return null
  }

  const pickImage = async () => {
    setImage(null)
    setCoordinates(null)

    if (Platform.OS === "ios") {
      // iOS: Solo galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
        // Intentar extraer GPS de la imagen
        const gps = await extractGPSFromExif(result.assets[0].uri)
        if (gps) setCoordinates(gps)
      }
    } else {
      // Android: Solo archivos
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri)
        // Intentar extraer GPS de la imagen
        const gps = await extractGPSFromExif(result.assets[0].uri)
        if (gps) setCoordinates(gps)
      }
    }
  }

  return (
    <View className="pb-5">
      {step === 1 ? (
        <>
          <View className="flex-row items-center justify-between px-2 pt-2">
            <View className="mx-2 mb-5 self-start rounded-lg bg-[#95d6fb] p-1 px-2">
              <Text className="font-Inter-Medium text-lg text-[#126ca1]">1º Selecionar Imagen</Text>
            </View>
            <TouchableOpacity
              onPress={() => image && setStep(2)}
              className={`mx-2 mb-5 flex-row items-center gap-1 self-start rounded-lg bg-[#95fb97] p-1 px-2 ${
                !image ? "opacity-50" : "opacity-100"
              }`}
              disabled={!image}
            >
              <Text className="font-Inter-Medium text-lg text-[#0c4607]">Continuar</Text>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                color={image ? "#0c4607" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {image ? (
            <View className="mx-2 space-y-4">
              <View className="h-[30vh] items-center justify-center overflow-hidden rounded-2xl bg-emerald-900">
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>

              <TouchableOpacity
                onPress={pickImage}
                className="mt-3 flex-row items-center justify-center gap-1 rounded-lg bg-orange-500 p-3"
              >
                <HugeiconsIcon
                  icon={ExchangeIcon}
                  size={25}
                  color="#ffedd5"
                />
                <Text className="text-center font-Inter-SemiBold text-lg text-orange-100">Cambiar imagen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              className="mx-2 h-[30vh] items-center justify-center rounded-2xl bg-emerald-900 px-8"
            >
              <HugeiconsIcon
                icon={ImageUploadIcon}
                size={50}
                color="#9affa1"
              />
              <Text className="mt-4 text-center font-Inter-Medium text-[#9affa1]">Seleccionar imagen</Text>
            </TouchableOpacity>
          )}
        </>
      ) : step === 2 ? (
        <View className="px-2 pt-2">
          <View className="mx-2 mb-5 self-start rounded-lg bg-[#95d6fb] p-1 px-2">
            <Text className="font-Inter-Medium text-lg text-[#126ca1]">2º Verificar Ubicación</Text>
          </View>

          {coordinates ? (
            <View className="mx-2 space-y-4">
              <View className="rounded-lg bg-green-100 p-4">
                <Text className="mb-2 font-Inter-SemiBold text-lg text-green-800">Coordenadas encontradas</Text>
                <Text className="font-Inter-Medium text-green-700">Latitud: {coordinates.lat.toFixed(6)}</Text>
                <Text className="font-Inter-Medium text-green-700">Longitud: {coordinates.lng.toFixed(6)}</Text>
              </View>

              <View className="h-80 w-full overflow-hidden rounded-xl">
                <MapView
                  style={{ flex: 1 }}
                  mapType="satellite"
                  showsCompass
                  showsScale
                  showsMyLocationButton={false}
                  initialRegion={{
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: coordinates.lat, longitude: coordinates.lng }}
                    anchor={{ x: 0.5, y: 1 }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}
                    >
                      {/* Contenedor del pin */}
                      <View>
                        {/* Foto circular */}
                        {image && (
                          <Image
                            source={{ uri: image }}
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 24,
                              borderWidth: 2,
                              borderColor: "#10b981",
                            }}
                            contentFit="cover"
                          />
                        )}
                      </View>

                      {/* Punta del pin - mejorada */}
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderLeftWidth: 10,
                          borderRightWidth: 10,
                          borderTopWidth: 15,
                          borderLeftColor: "transparent",
                          borderRightColor: "transparent",
                          borderTopColor: "#fff",
                          marginTop: -3,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.2,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      />
                    </View>
                  </Marker>
                </MapView>
              </View>
            </View>
          ) : (
            <View className="mx-2 space-y-4">
              <View className="rounded-lg bg-yellow-100 p-4">
                <Text className="mb-2 font-Inter-SemiBold text-lg text-yellow-800">No se encontraron coordenadas</Text>
                <Text className="font-Inter-Medium text-yellow-700">La imagen no contiene datos de ubicación GPS</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setStep(1)}
            className="mx-2 mt-4 flex-row items-center justify-center gap-1 rounded-lg bg-gray-500 p-3"
          >
            <Text className="text-center font-Inter-SemiBold text-lg text-white">Volver</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}
