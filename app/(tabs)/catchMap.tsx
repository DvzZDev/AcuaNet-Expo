import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useEffect, useState, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowExpand01Icon, ArrowShrink01Icon, CalendarLove01Icon, ImageAdd02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import AddCatchBottomSheet from "app/catchMap/AddCatchBottomSheet"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { Stack } from "expo-router"
import { useUserCatchReports } from "querys"
import { useStore } from "store"
import MapView, { Marker } from "react-native-maps"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { getFishImage } from "lib/getFishImage"
import { ScrollView } from "react-native-gesture-handler"

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width

export default function Geocode() {
  const insets = useSafeAreaInsets()
  const [isOpen, setIsOpen] = useState(false)
  const userId = useStore((state) => state.id)
  const UserCatchReports = useUserCatchReports(userId)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const mapRef = useRef<MapView>(null)
  const collapsedHeight = SCREEN_HEIGHT * 0.4
  const expandedHeight = SCREEN_HEIGHT * 1
  const height = useSharedValue(collapsedHeight)
  const scale = useSharedValue(1)

  useEffect(() => {
    height.value = withTiming(isMapExpanded ? expandedHeight : collapsedHeight, { duration: 300 })
    scale.value = withTiming(isMapExpanded ? 1.1 : 1, { duration: 300 })
  }, [isMapExpanded, expandedHeight, collapsedHeight, height, scale])

  useEffect(() => {
    if (UserCatchReports.data && UserCatchReports.data.length > 0 && mapRef.current) {
      const latestReport = UserCatchReports.data[0]
      if (latestReport.lat && latestReport.lng) {
        const newRegion = {
          latitude: latestReport.lat,
          longitude: latestReport.lng,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }

        mapRef.current.animateToRegion(newRegion, 1000)
      }
    }
  }, [UserCatchReports.data])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
    width: SCREEN_WIDTH,
    paddingHorizontal: isMapExpanded ? 0 : 16,
    borderRadius: isMapExpanded ? 0 : 15,
    overflow: "hidden",
  }))

  const animatedMapStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ scale: scale.value }],
    position: "relative",
  }))

  if (UserCatchReports.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-Inter-Medium text-lg text-emerald-600">Cargando capturas...</Text>
        <LinearGradient
          colors={["#effcf3", "#9affa1"]}
          style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
        />
      </View>
    )
  }

  if (UserCatchReports.isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-Inter-Medium text-lg text-red-600">Error al cargar las capturas</Text>
        <LinearGradient
          colors={["#effcf3", "#9affa1"]}
          style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
        />
      </View>
    )
  }

  const markers =
    UserCatchReports.data?.map((report, index) => {
      const imageUrl = report.imagenes?.[0]
      return {
        key: index,
        latitude: report.lat!,
        longitude: report.lng!,
        imagen: `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${imageUrl}`,
      }
    }) || []

  const embalseCoordinates = {
    latitude: markers.length > 0 ? markers[0].latitude : 40.4637,
    longitude: markers.length > 0 ? markers[0].longitude : -3.7492,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {!isMapExpanded && (
          <View
            style={{ paddingTop: insets.top + 5 }}
            className="flex-row items-center justify-between border-gray-300 bg-[#effcf3] px-4 pb-4"
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
        )}

        <Animated.View style={animatedContainerStyle}>
          {!isMapExpanded && (
            <Text className="mb-2 font-Inter-SemiBold text-2xl text-emerald-950">
              {markers.length > 0 ? "Tu último pin 📷" : "No hay capturas registradas 🎣"}
            </Text>
          )}

          <Animated.View style={animatedMapStyle}>
            <MapView
              ref={mapRef}
              mapType="satellite"
              style={{ flex: 1, borderRadius: 20 }}
              showsCompass
              showsScale
              showsMyLocationButton
              zoomControlEnabled
              initialRegion={embalseCoordinates}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.key}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    className="items-center justify-center rounded-full border-2 border-green-500 shadow-lg"
                    style={{ width: 33, height: 33 }}
                  >
                    <Image
                      source={{ uri: marker.imagen }}
                      style={{ width: 29, height: 29, borderRadius: 14.5 }}
                      contentFit="cover"
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          </Animated.View>

          <TouchableOpacity
            onPress={() => setIsMapExpanded(!isMapExpanded)}
            className={`absolute rounded-full bg-[#14141c] p-2 shadow-lg ${isMapExpanded ? "right-4" : "right-8"}`}
            style={{ top: insets.top + 8 }}
          >
            <HugeiconsIcon
              icon={isMapExpanded ? ArrowShrink01Icon : ArrowExpand01Icon}
              size={25}
              color="#14b981"
            />
          </TouchableOpacity>

          {isMapExpanded && (
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              className="absolute left-4 rounded-full bg-[#14141c] p-2 shadow-lg"
              style={{ top: insets.top + 8 }}
            >
              <HugeiconsIcon
                icon={ImageAdd02Icon}
                size="25"
                color="#10b981"
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        {!isMapExpanded && (
          <View className="mx-4 mt-6 flex-col ">
            <Text className="mb-3 font-Inter-SemiBold text-2xl text-emerald-950">Tu última captura</Text>
            {UserCatchReports.data?.map((report, index) => (
              <TouchableOpacity key={index}>
                <View className="mb-2 flex h-36 flex-row gap-4 rounded-2xl bg-emerald-900 p-2">
                  <View className="aspect-square overflow-hidden rounded-xl bg-green-50">
                    <Image
                      source={{
                        uri: report.imagenes?.[0]
                          ? `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${report.imagenes[0]}`
                          : "https://via.placeholder.com/150",
                      }}
                      style={{
                        width: "100%",
                        flex: 1,
                      }}
                      contentFit="cover"
                    />
                  </View>

                  <View className="flex-col gap-2">
                    <Text className="font-Inter-SemiBold text-2xl text-green-200">{report.embalse}</Text>
                    <View className="flex-row items-center justify-center gap-2 rounded-2xl  bg-green-800 px-2 py-1">
                      <HugeiconsIcon
                        icon={CalendarLove01Icon}
                        size={15}
                        color="red"
                        strokeWidth={1.5}
                      />
                      <Text className="font-Inter-Medium text-base text-green-300">
                        {new Date(report.fecha).toLocaleDateString("es-Es", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        })}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2 self-start rounded-2xl  bg-green-800 px-2 py-1">
                      <Image
                        source={getFishImage(report.especie)}
                        style={{ height: 20, width: 35, borderRadius: 7.5 }}
                      />
                      <Text className="font-Inter-Medium text-base text-green-300">{report.especie}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <AddCatchBottomSheet
          isOpen={isOpen}
          setOpen={setIsOpen}
        />
      </ScrollView>
    </>
  )
}
