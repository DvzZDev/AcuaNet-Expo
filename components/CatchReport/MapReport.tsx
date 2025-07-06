import { View, Text, TouchableOpacity } from "react-native"
import React, { useRef } from "react"
import MapView, { Marker } from "react-native-maps"
import { Image } from "expo-image"
import LottieView from "lottie-react-native"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { PlusSignIcon, Remove01Icon } from "@hugeicons/core-free-icons"

export default function MapReport({
  lat,
  lng,
  catch_id,
  imagenes,
}: {
  lat?: number
  lng?: number
  catch_id?: string
  imagenes?: string
}) {
  const mapRef = useRef<MapView>(null)

  const zoomMap = (zoomIn: boolean) => {
    if (!mapRef.current) return

    mapRef.current.getCamera().then((camera) => {
      if (camera.zoom !== undefined) {
        camera.zoom = zoomIn ? camera.zoom + 1 : camera.zoom - 1
        mapRef.current?.animateCamera(camera, { duration: 300 })
      }
    })
  }
  return (
    <View
      className="relative mt-8 flex-1 overflow-hidden rounded-2xl"
      style={{ height: 300 }}
    >
      <MapView
        ref={mapRef}
        mapType="satellite"
        style={{ flex: 1 }}
        initialRegion={{
          latitude: lat || 40.4168,
          longitude: lng || -3.7038,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
      >
        {lat && lng && (
          <Marker
            key={catch_id}
            coordinate={{ latitude: lat, longitude: lng }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              className="items-center justify-center rounded-full border-2 border-green-500 shadow-lg"
              style={{ width: 33, height: 33 }}
            >
              <Image
                source={{
                  uri: `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${imagenes || ""}`,
                }}
                style={{ width: 29, height: 29, borderRadius: 14.5 }}
                contentFit="cover"
              />
            </View>
          </Marker>
        )}
      </MapView>
      <View className="absolute bottom-3 right-3 flex gap-2">
        <TouchableOpacity
          onPress={() => zoomMap(true)}
          className="rounded-full bg-[#14141c] p-2 shadow-lg"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={24}
            color="#14b981"
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => zoomMap(false)}
          className="rounded-full bg-[#14141c] p-2 shadow-lg"
        >
          <HugeiconsIcon
            icon={Remove01Icon}
            size={24}
            color="#14b981"
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
      <View className="absolute left-3 top-3 flex-row items-center justify-center rounded-2xl bg-emerald-200 px-2">
        <LottieView
          source={require("@assets/animations/Location.json")}
          autoPlay
          loop
          style={{ width: 30, height: 28 }}
        />
        <Text className="font-Inter-SemiBold text-lg text-emerald-950">Localización</Text>
      </View>
    </View>
  )
}
