import React from "react"
import { View, Text } from "react-native"
import MapView from "react-native-maps"
import StepHeader from "./StepHeader"
import MapComponent from "./MapDisplay"
import PlaceSearch from "../UploadCatch/PlaceSearch"
import { type GPSCoordinates } from "lib/extractGPSCoordinates"

interface Step2VerifyLocationProps {
  coordinates: GPSCoordinates | null
  userCoordinates: GPSCoordinates | null
  images: string[]
  isEditMode: boolean
  onToggleEdit: () => void
  onDragEnd: (coords: GPSCoordinates) => void
  onLocationSelect: (coords: GPSCoordinates) => void
  onInputFocus: (reactNode: any) => void
  onPrev: () => void
  onNext: () => void
  onLayout: (event: any) => void
  mapRef: React.RefObject<MapView | null>
}

export default function Step2VerifyLocation({
  coordinates,
  userCoordinates,
  images,
  isEditMode,
  onToggleEdit,
  onDragEnd,
  onLocationSelect,
  onInputFocus,
  onPrev,
  onNext,
  onLayout,
  mapRef,
}: Step2VerifyLocationProps) {
  return (
    <View
      onLayout={onLayout}
      className="px-2 pt-2"
    >
      <StepHeader
        stepNumber="2º"
        title="Verificar Ubicación"
        color="text-[#126ca1]"
        bgColor="bg-[#95d6fb]"
        animationSource={require("@assets/animations/Location.json")}
        onPrev={onPrev}
        onNext={onNext}
      />
      {coordinates ? (
        <View className="mx-2 gap-3">
          <View className="self-start rounded-lg bg-green-200 p-1 px-2">
            <Text className="font-Inter-Medium text-base text-green-800">Localización encontrada</Text>
          </View>
          <MapComponent
            coordinates={coordinates}
            images={images}
            isEditMode={isEditMode}
            onToggleEdit={onToggleEdit}
            onDragEnd={onDragEnd}
          />
        </View>
      ) : (
        <View className="mx-2 gap-2">
          <View className="self-start rounded-lg bg-yellow-100 p-1">
            <Text className="font-Inter-Medium text-base text-yellow-800">⚠️ No se encontraron coordenadas</Text>
          </View>
          <PlaceSearch
            onLocationSelect={onLocationSelect}
            onInputFocus={onInputFocus}
          />
          <MapComponent
            coordinates={userCoordinates}
            images={images}
            isEditMode={isEditMode}
            onToggleEdit={onToggleEdit}
            onDragEnd={onLocationSelect}
            mapRef={mapRef}
          />
        </View>
      )}
    </View>
  )
}
