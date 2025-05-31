import React, { useState } from "react"
import MapView from "react-native-maps"
import { View, Text, ActivityIndicator } from "react-native"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { MapsLocation01Icon } from "@hugeicons/core-free-icons"

interface MapsProps {
  coords?: { latitude: number; longitude: number }
}

export default function Maps({ coords }: MapsProps) {
  const [isMapReady, setIsMapReady] = useState(false)

  if (!coords) return null
  const embalseCoordinates = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
  console.log("Embalse Coordinates:", embalseCoordinates)
  return (
    <View
      className="flex-1 overflow-hidden bg-[#f0f0f0]"
      style={{ minHeight: 500 }}
    >
      <View className="absolute left-4 top-4 z-20 flex-row gap-2">
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
            Mapas: Topográfico y de Viento
          </Text>
        </View>
      </View>

      {!isMapReady && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-white/80">
          <ActivityIndicator
            size="large"
            color="#0066CC"
          />
          <ActivityIndicator size="large" />
        </View>
      )}
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
      ></MapView>
    </View>
  )
}
