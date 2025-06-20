import { ImageAdd02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import AddCatchBottomSheet from "app/catchMap/AddCatchBottomSheet"
import { LinearGradient } from "expo-linear-gradient"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import MapView from "react-native-maps"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Geocode() {
  const insets = useSafeAreaInsets()
  const [isOpen, setIsOpen] = useState(false)

  const embalseCoordinates = {
    latitude: 40.90160192371845,
    longitude: -3.5298093713351313,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View
              style={{
                paddingTop: insets.top + 5,
                shadowRadius: 0,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
              }}
              className="`pb-4 flex-row items-center justify-between border-gray-300 bg-[#effcf3] px-4"
            >
              <Text className="font-Inter-Medium text-3xl">
                Catch <Text className="font-Inter-Black text-4xl text-emerald-500">Map</Text>
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="right-2 w-fit rounded-full bg-[#14141c] p-2"
              >
                <HugeiconsIcon
                  icon={ImageAdd02Icon}
                  size="30"
                  color="#10b981"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <StatusBar
        style="light"
        translucent
      />

      <View className="h-[40vh] w-full gap-3 p-4">
        <Text className="font-Inter-SemiBold text-2xl text-emerald-950">Tu último pin 📷</Text>
        {/* <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
          <MapView
            mapType="satellite"
            style={{ flex: 1 }}
            showsCompass
            showsScale
            showsMyLocationButton
            initialRegion={embalseCoordinates}
          />
        </View> */}
      </View>

      <View className="mx-4 mb-4 flex-row items-center justify-between">
        <Text className="font-Inter-SemiBold text-2xl text-emerald-950">Tu última captura</Text>
      </View>

      <AddCatchBottomSheet
        isOpen={isOpen}
        setOpen={setIsOpen}
      />
    </>
  )
}
