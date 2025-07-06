import { MapsEditingIcon, Tick01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Image } from "expo-image"
import { GPSCoordinates } from "lib/extractGPSCoordinates"
import { TouchableOpacity, View } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { twMerge } from "tailwind-merge"

export default function MapComponent({
  coordinates,
  images,
  isEditMode,
  onToggleEdit,
  onDragEnd,
  mapRef,
}: {
  coordinates: GPSCoordinates | null
  images: string[]
  isEditMode: boolean
  onToggleEdit: () => void
  onDragEnd: (coords: GPSCoordinates) => void
  mapRef?: React.RefObject<MapView | null>
}) {
  const region = coordinates
    ? {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : {
        latitude: 40.15513081892512,
        longitude: -4.139463936743206,
        latitudeDelta: 9,
        longitudeDelta: 9,
      }

  return (
    <View className="relative h-80 w-full overflow-hidden rounded-xl">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        loadingBackgroundColor="#bbf7d0"
        loadingIndicatorColor="#7ed321"
        mapType="satellite"
        showsCompass
        zoomControlEnabled
        showsScale
        showsMyLocationButton={false}
        initialRegion={region}
      >
        {coordinates && (
          <Marker
            coordinate={{ latitude: coordinates.lat, longitude: coordinates.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            draggable={isEditMode}
            onDragEnd={(e) => {
              const newCoords = e.nativeEvent.coordinate
              onDragEnd({
                lat: newCoords.latitude,
                lng: newCoords.longitude,
              })
            }}
          >
            <View
              className={twMerge(
                "items-center justify-center rounded-full border-2 shadow-lg",
                isEditMode ? "border-orange-500" : "border-green-500"
              )}
              style={{ width: 35, height: 35 }}
            >
              {images[0] && (
                <Image
                  source={{ uri: images[0] }}
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 14.5,
                  }}
                  contentFit="cover"
                />
              )}
            </View>
          </Marker>
        )}
      </MapView>
      <TouchableOpacity
        onPress={onToggleEdit}
        className="absolute right-4 top-4 rounded-full bg-[#14141c] p-2 shadow-lg"
      >
        <HugeiconsIcon
          icon={isEditMode ? Tick01Icon : MapsEditingIcon}
          size={24}
          color="#7ed321"
          strokeWidth={isEditMode ? 1.5 : undefined}
        />
      </TouchableOpacity>
    </View>
  )
}
