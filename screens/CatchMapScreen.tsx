import { Dimensions, StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Alert } from "react-native"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import {
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  CalendarLove01Icon,
  ImageAdd02Icon,
  PlusSignIcon,
  Remove01Icon,
  Delete02Icon,
  Album02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import AddCatchBottomSheet from "@components/CatchMap/AddCatchBottomSheet"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useDeleteCatchReporte, useUserCatchReports } from "querys"
import { useStore } from "store"
import MapView, { Marker } from "react-native-maps"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SequencedTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated"
import { getFishImage } from "lib/getFishImage"
import { ScrollView } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "types/index"

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width

export default function CatchMap() {
  const navigation = useNavigation<RootStackNavigationProp<"CatchReport">>()
  const userId = useStore((state) => state.id)
  const insets = useSafeAreaInsets()
  const [isOpen, setIsOpen] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const mapRef = useRef<MapView>(null)
  const UserCatchReports = useUserCatchReports(userId)
  const deleteCatchMutation = useDeleteCatchReporte()
  const swipeableRefs = useRef<Map<string, any>>(new Map())
  const collapsedHeight = SCREEN_HEIGHT * 0.4
  const expandedHeight = SCREEN_HEIGHT * 1
  const height = useSharedValue(collapsedHeight)
  const scale = useSharedValue(1)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#effcf3",
      },
      headerShadowVisible: false,
      headerTitleAlign: "left",
      headerShown: isMapExpanded ? false : true,
      animation: "fade",

      headerTitle: () => (
        <Text className="font-Inter-Medium text-3xl">
          Catch <Text className="font-Inter-Black text-4xl text-emerald-500">Map</Text>
        </Text>
      ),

      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          className="right-4 w-fit rounded-full bg-[#14141c] p-2"
        >
          <HugeiconsIcon
            icon={ImageAdd02Icon}
            size="30"
            color="#10b981"
          />
        </TouchableOpacity>
      ),
    })
  }, [navigation, isMapExpanded])

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

  useEffect(() => {
    if (UserCatchReports.data) {
      setTimeout(() => {
        setMapKey((prev) => prev + 1)
      }, 100)
    }
  }, [UserCatchReports.data])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
    width: SCREEN_WIDTH,
    paddingHorizontal: isMapExpanded ? 0 : 16,
    overflow: "hidden",
    marginTop: isMapExpanded ? -15 : 0,
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
        key: `${report.catch_id}-${index}`,
        latitude: report.lat!,
        longitude: report.lng!,
        imagen: `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${imageUrl}`,
        catchId: report.catch_id,
      }
    }) || []

  const embalseCoordinates = {
    latitude: markers.length > 0 ? markers[0].latitude : 40.4637,
    longitude: markers.length > 0 ? markers[0].longitude : -3.7492,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  }

  const zoomMap = (zoomIn: boolean) => {
    if (!mapRef.current) return

    mapRef.current.getCamera().then((camera) => {
      if (camera.zoom !== undefined) {
        camera.zoom = zoomIn ? camera.zoom + 1 : camera.zoom - 1
        mapRef.current?.animateCamera(camera, { duration: 300 })
      }
    })
  }

  const styles = StyleSheet.create({
    rightAction: {
      width: 80,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#dc2626",
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    },
    separator: {
      width: "100%",
      borderTopWidth: 1,
    },
    swipeable: {
      height: "100%",
      width: "100%",
      borderRadius: 15,
      backgroundColor: "papayawhip",
      alignItems: "center",
    },
  })

  const handleDeleteCatch = (catchId: string) => {
    if (!catchId) {
      Alert.alert("Error", "No se puede eliminar el reporte. Datos inválidos.")
      return
    }

    Alert.alert(
      "¿Eliminar CatchReport?",
      "Esta acción es permanente y no se puede revertir.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              console.log("Elemento eliminado")
              deleteCatchMutation.mutate(catchId, {
                onSuccess: () => {
                  console.log("Captura eliminada exitosamente")
                  const swipeableRef = swipeableRefs.current.get(catchId)
                  if (swipeableRef) {
                    swipeableRef.close()
                  }
                },
                onError: (error) => {
                  console.error("Error al eliminar la captura:", error)
                  Alert.alert("Error", "No se pudo eliminar la captura. Inténtalo más tarde.")
                },
              })
            } catch (error) {
              console.error("Error inesperado:", error)
              Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo más tarde.")
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    )
  }

  const RightActionButton = ({ catchId }: { catchId: string }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        onPress={() => handleDeleteCatch(catchId)}
      >
        <HugeiconsIcon
          icon={Delete02Icon}
          size={30}
          color="#fef2f2"
          strokeWidth={2}
        />
      </TouchableOpacity>
    )
  }

  function createRightAction(catchId: string) {
    return () => {
      return (
        <Animated.View style={styles.rightAction}>
          <RightActionButton catchId={catchId} />
        </Animated.View>
      )
    }
  }

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        style={{
          overflow: "visible",
          marginTop: isMapExpanded ? 0 : 15,
        }}
      >
        <Animated.View style={animatedContainerStyle}>
          {!isMapExpanded && (
            <Text className="mb-3 font-Inter-SemiBold text-2xl text-emerald-950">
              {markers.length > 0 ? "Tu último pin 📷" : "No hay capturas registradas 🎣"}
            </Text>
          )}

          <Animated.View style={animatedMapStyle}>
            <View style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}>
              <MapView
                key={mapKey}
                ref={mapRef}
                mapType="satellite"
                style={{ flex: 1 }}
                initialRegion={embalseCoordinates}
              >
                {markers.map((marker) => (
                  <Marker
                    key={marker.key}
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    onPress={() => navigation.navigate("CatchReport", { catchReportId: marker.catchId })}
                  >
                    <View
                      className="items-center justify-center rounded-full border-2 border-green-500 shadow-lg"
                      style={{ width: 33, height: 33 }}
                    >
                      <Image
                        source={{ uri: marker.imagen }}
                        style={{ width: 29, height: 29, borderRadius: 14.5 }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        recyclingKey={marker.key}
                        onLoad={() => {
                          if (mapRef.current) {
                            mapRef.current.forceUpdate?.()
                          }
                        }}
                        placeholder={{
                          uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyOSAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQuNSIgY3k9IjE0LjUiIHI9IjE0LjUiIGZpbGw9IiMxMGI5ODEiLz4KPC9zdmc+Cg==",
                        }}
                      />
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>
          </Animated.View>

          <View className={`absolute  flex gap-2 ${isMapExpanded ? "bottom-40 right-3" : "bottom-8 right-8"}`}>
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
          <Animated.View
            layout={SequencedTransition}
            className="mt-6 flex-col"
          >
            <View className="mx-4 mb-3 flex-row items-center justify-between">
              <Text className="font-Inter-SemiBold text-2xl text-emerald-950">Tus últimas 3 capturas</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Gallery")}
                className="rounded-2xl bg-purple-200 p-2"
              >
                <View className="flex-row items-center justify-center gap-1">
                  <HugeiconsIcon
                    icon={Album02Icon}
                    size={20}
                    color="#6b21a8"
                    strokeWidth={1.5}
                  />
                  <Text className="font-Inter-SemiBold text-purple-800">Ver todas</Text>
                </View>
              </TouchableOpacity>
            </View>

            {UserCatchReports.data?.slice(0, 3)?.map((report) => (
              <Animated.View
                key={report.catch_id}
                layout={SequencedTransition}
                entering={FadeIn}
                exiting={FadeOut}
                className="mx-4 mb-2"
                style={{
                  borderRadius: 15,
                  backgroundColor: "#dc2626",
                  overflow: "hidden",
                }}
              >
                <ReanimatedSwipeable
                  ref={(ref) => {
                    if (ref) {
                      swipeableRefs.current.set(report.catch_id, ref)
                    }
                  }}
                  renderRightActions={createRightAction(report.catch_id)}
                  containerStyle={{ overflow: "visible" }}
                  rightThreshold={40}
                  friction={2}
                  overshootFriction={8}
                  enableTrackpadTwoFingerGesture
                  dragOffsetFromRightEdge={80}
                >
                  <TouchableHighlight
                    onPress={() => navigation.navigate("CatchReport", { catchReportId: report.catch_id })}
                  >
                    <View
                      className="flex h-36 flex-row gap-4 bg-emerald-900 p-2"
                      style={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}
                    >
                      <View className="aspect-square overflow-hidden rounded-xl">
                        <Image
                          source={{
                            uri: report.imagenes?.[0]
                              ? `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${report.imagenes[0]}`
                              : "https://via.placeholder.com/150",
                          }}
                          style={{ width: "100%", flex: 1 }}
                          contentFit="cover"
                        />
                      </View>

                      <View className="flex-col gap-2">
                        <Text className="font-Inter-SemiBold text-2xl text-green-200">{report.embalse}</Text>

                        <View className="flex-row items-center justify-center gap-2 rounded-2xl bg-green-800 px-2 py-1">
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

                        <View className="flex-row items-center gap-2 self-start rounded-2xl bg-green-800 px-2 py-1">
                          {getFishImage(report.especie) && (
                            <Image
                              source={getFishImage(report.especie)}
                              style={{ height: 20, width: 35, borderRadius: 7.5 }}
                            />
                          )}
                          <Text className="font-Inter-Medium text-base text-green-300">{report.especie}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                </ReanimatedSwipeable>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <AddCatchBottomSheet
          isOpen={isOpen}
          setOpen={setIsOpen}
        />
      </ScrollView>
    </>
  )
}
