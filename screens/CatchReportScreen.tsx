import { Backward01Icon, Delete02Icon, MoreVerticalIcon, MoreVerticalSquare01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import ImageCarrousel from "components/CatchReport/ImageCarrousel"
import { LinearGradient } from "expo-linear-gradient"
import { useHistoricalWeather, useUserCatchReports } from "querys"
import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert, Dimensions, Image } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStore } from "store"
import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect, useCallback, useRef, useState } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { supabase } from "lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import LunarReport from "@components/CatchReport/LunarReport"
import ReportComents from "@components/CatchReport/ReportComents"
import EmbStatusReport from "@components/CatchReport/EmbStatusReport"
import MapReport from "@components/CatchReport/MapReport"
import ChipsReport from "@components/CatchReport/ChipsReport"
import HistoricalWeather from "@components/CatchReport/HistoricalWeather"
import ViewShot from "react-native-view-shot"
import * as Sharing from "expo-sharing"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { BlurView } from "expo-blur"

export default function CatchReportPage({ route }: { route: any }) {
  const { catchReportId } = route.params
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const userId = useStore((state) => state.id)
  const allData = useUserCatchReports(userId)
  const data = allData.data?.find((report) => report.catch_id === catchReportId)
  const viewRef = useRef<ViewShot>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  console.log(isOptionsOpen)

  const generarStory = async () => {
    try {
      if (!viewRef.current?.capture) {
        Alert.alert("Error", "No se puede capturar la imagen en este momento")
        return
      }
      setIsCapturing(true)
      await new Promise((resolve) => setTimeout(resolve, 700))
      const uri = await viewRef.current.capture()

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri)
      } else {
        Alert.alert("Error", "No se puede compartir en este dispositivo")
      }

      setIsCapturing(false)
    } catch (error) {
      console.error("Error al capturar imagen:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      Alert.alert("Error", "No se pudo capturar la imagen: " + errorMessage)
      setIsCapturing(false)
    }
  }

  const {
    catch_id,
    peso,
    comentarios,
    lat,
    lng,
    emb_data,
    profundidad,
    temperatura,
    tecnica,
    situacion,
    especie,
    estacion,
    fecha,
    embalse,
    imagenes,
  } = data || {}

  const fechaFormatted = fecha ? new Date(fecha) : undefined
  const historicalWeather = useHistoricalWeather(
    lat !== undefined && lat !== null ? lat : undefined,
    lng !== undefined && lng !== null ? lng : undefined,
    fechaFormatted || new Date()
  )

  const handleDelete = useCallback(async () => {
    if (!catch_id) {
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
              const { error } = await supabase.from("catch_reports").delete().eq("catch_id", catch_id)
              if (error) {
                console.error("Error al eliminar el reporte:", error)
                Alert.alert("Error", "No se pudo eliminar el reporte. Inténtalo más tarde.")
                return
              }

              navigation.goBack()

              await queryClient.invalidateQueries({ queryKey: ["userCatchReports", userId] })
              await queryClient.invalidateQueries({ queryKey: ["catchReports"] })

              console.log("Elemento eliminado")
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
  }, [catch_id, navigation, queryClient, userId])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: Platform.OS === "ios",
      headerBlurEffect: Platform.OS === "ios" ? "light" : undefined,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Platform.OS === "ios" ? "transparent" : "#effcf3",
      },
      headerBackVisible: false,

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl bg-[#14141c] p-2"
          style={{ marginLeft: 8 }}
        >
          <HugeiconsIcon
            icon={Backward01Icon}
            size={20}
            color="#14b981"
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ),

      headerTitle: () => (
        <Text
          style={{
            fontSize: 25,
            fontFamily: "Inter-SemiBold",
            color: "#022c22",
            textAlign: "center",
            maxWidth: Dimensions.get("window").width * 0.6,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {embalse || "Reporte"}
        </Text>
      ),

      headerTitleAlign: "center",

      headerRight: () => (
        <View style={{ position: "relative", marginRight: 8 }}>
          <TouchableOpacity
            onPress={() => setIsOptionsOpen(!isOptionsOpen)}
            className="rounded-xl bg-emerald-100 p-2"
          >
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              size={24}
              color="#10b981"
              strokeWidth={4}
            />
          </TouchableOpacity>
          {isOptionsOpen && (
            <Animated.View
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(150)}
              className="absolute right-0 top-10 z-10 w-[15rem] overflow-hidden rounded-lg shadow-lg"
            >
              <BlurView
                intensity={80}
                experimentalBlurMethod="dimezisBlurView"
                tint="light"
                className="relative"
              ></BlurView>
            </Animated.View>
          )}

          {/* <TouchableOpacity
            onPress={generarStory}
            className="mr-2 rounded-xl bg-blue-100 p-2"
          >
            <Text style={{ color: "blue", fontSize: 12, fontWeight: "bold", lineHeight: 0 }}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete()}
            className="rounded-xl bg-red-100 p-2"
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              size={20}
              color="red"
              strokeWidth={1.5}
            />
          </TouchableOpacity> */}
        </View>
      ),

      headerShown: true,
      animation: "fade",
    })
  }, [navigation, embalse, handleDelete])

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Cargando...</Text>
      </View>
    )
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
          paddingTop: Platform.OS === "ios" ? headerHeight : 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewRef}
          options={{
            format: "jpg",
            quality: 0.9,
            result: "tmpfile",
          }}
        >
          <LinearGradient
            colors={["#effcf3", "#9affa1"]}
            style={{ minHeight: "100%" }}
          >
            <View className="relative">
              <ImageCarrousel paths={imagenes} />
              {isCapturing && (
                <View className="absolute bottom-2 right-0 z-20 w-full flex-row items-end justify-between px-3 py-2">
                  <View className="h-fit w-[10rem] rounded-lg shadow-md">
                    <Image
                      source={require("../assets/Publi.webp")}
                      style={{
                        width: "100%",
                        height: 45,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className="h-fit w-[8rem] rounded-lg shadow-md">
                    <Image
                      source={require("../assets/Stores.webp")}
                      style={{
                        width: "100%",
                        height: 70,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </View>

            <View className="m-4">
              <ChipsReport
                especie={especie || undefined}
                peso={peso || undefined}
                epoca={estacion}
                situacion={situacion || undefined}
                temperatura={temperatura || undefined}
                tecnica={tecnica || undefined}
                profundidad={profundidad || undefined}
                fecha={fecha ? new Date(fecha) : undefined}
              />

              <MapReport
                catch_id={catch_id}
                imagenes={imagenes && imagenes[0]}
                lat={lat}
                lng={lng}
              />

              {emb_data ? (
                <EmbStatusReport
                  embalse={embalse || "n/d"}
                  emb_data={emb_data}
                  fecha={fecha ? new Date(fecha) : new Date()}
                />
              ) : null}

              {fecha && lat && lng && historicalWeather?.data && (
                <HistoricalWeather
                  fecha={fecha}
                  weatherData={historicalWeather.data}
                />
              )}

              <LunarReport date={fecha ? new Date(fecha) : new Date()} />

              {comentarios ? <ReportComents comentarios={comentarios} /> : null}
            </View>
          </LinearGradient>
        </ViewShot>
      </ScrollView>
    </>
  )
}
