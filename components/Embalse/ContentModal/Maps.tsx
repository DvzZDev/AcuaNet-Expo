import React, { useState } from "react"
import MapView from "react-native-maps"
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { FastWindIcon, MapsLocation01Icon, Satellite01FreeIcons } from "@hugeicons/core-free-icons"
import { WebView } from "react-native-webview"

interface MapsProps {
  coords?: { latitude: number; longitude: number }
}

export default function Maps({ coords }: MapsProps) {
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapType, setMapType] = useState<"topographic" | "wind">("topographic")

  if (!coords) return null
  const embalseCoordinates = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  }
  console.log("Embalse Coordinates:", embalseCoordinates)
  return (
    <View
      className="flex-1 overflow-hidden bg-[#f0f0f0]"
      style={{ minHeight: 500 }}
    >
      <View className="absolute left-4 top-4 z-20 flex flex-row gap-2">
        <View
          className="flex-row items-center gap-1.5 self-start rounded-[10px] border p-1"
          style={{
            borderColor: "#FF890080",
            backgroundColor: "#FFDFBA",
          }}
        >
          <HugeiconsIcon
            icon={MapsLocation01Icon}
            size={20}
            color="#FF8900"
          />
          <Text
            className="font-['Inter'] text-base"
            style={{ color: "#FF8900" }}
          >
            {mapType === "wind" ? "Mapa de Viento" : "Mapa Topográfico"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setMapType(mapType === "wind" ? "topographic" : "wind")}
          className="flex-row items-center justify-center gap-1 rounded-[10px] border px-2 py-1"
          style={{
            borderColor: "#0066CC80",
            backgroundColor: "#E6F3FF",
          }}
        >
          <HugeiconsIcon
            icon={mapType === "wind" ? Satellite01FreeIcons : FastWindIcon}
            size="20"
            color="#0066CC"
          />
          <Text
            className="font-['Inter'] text-sm font-medium"
            style={{ color: "#0066CC" }}
          >
            {mapType === "wind" ? "Ver Topográfico" : "Ver Viento"}
          </Text>
        </TouchableOpacity>
      </View>

      {!isMapReady && mapType === "topographic" && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-white/80">
          <ActivityIndicator
            size="large"
            color="#0066CC"
          />
        </View>
      )}

      {mapType === "wind" ? (
        <WebView
          source={{
            uri: `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=11&overlay=wind&product=ecmwf&level=surface&lat=${coords.latitude}&lon=${coords.longitude}&detailLat=${coords.latitude}&detailLon=${coords.longitude}&marker=true&message=true`,
          }}
        />
      ) : (
        <MapView
          style={{ flex: 1, minHeight: 500 }}
          initialRegion={embalseCoordinates}
          onMapReady={() => setIsMapReady(true)}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          mapType="satellite"
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
        />
      )}
    </View>
  )
}
