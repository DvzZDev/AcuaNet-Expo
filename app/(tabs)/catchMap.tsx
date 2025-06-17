import { ImageAdd02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { StatusBar } from "expo-status-bar"
import { TouchableOpacity, View } from "react-native"
import MapView from "react-native-maps"

export default function Geocode() {
  const embalseCoordinates = {
    latitude: 40.90160192371845,
    longitude: -3.5298093713351313,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  }
  return (
    <>
      <StatusBar
        style="light"
        translucent
      />
      <View className="relative">
        <MapView
          mapType="satellite"
          style={{ height: "100%", width: "100%" }}
          showsCompass
          showsScale
          showsMyLocationButton
          mapPadding={{
            top: 80,
            right: 0,
            bottom: 80,
            left: 0,
          }}
          initialRegion={embalseCoordinates}
        />

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 100,
          }}
          className="right-2 w-fit rounded-full bg-[#14141c] p-4"
        >
          <HugeiconsIcon
            icon={ImageAdd02Icon}
            size="35"
            color="#b3e8ba"
          />
        </TouchableOpacity>
      </View>
    </>
  )
}
