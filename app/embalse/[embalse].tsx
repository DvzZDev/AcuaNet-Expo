import type { EmbalseDataHistorical, EmbalseDataLive, EmbalseDataPortugal } from "../../types"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { HistoricalData, LiveData, PortugalData } from "querys"
import { useEffect, useState } from "react"
import { ActivityIndicator, TouchableOpacity, StyleSheet, Text, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Calendar from "@assets/icons/calendar"
import Ai from "@assets/icons/ai"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  CalendarCheckIn01Icon,
  ChartLineData02FreeIcons,
  LiveStreaming02Icon,
  MapsLocation01Icon,
  MoonIcon,
  RainbowIcon,
} from "@hugeicons/core-free-icons"
import Animated, { FadeIn } from "react-native-reanimated"
import BottomSheetModalComponent from "components/Embalse/BottomSheet/BottomSheet"
import { useWeather } from "lib/getWeather"
import Resume from "components/Embalse/Resume"
import FavButton from "components/Embalse/FavButton"
import { useStore } from "../../store"

export default function Embalse() {
  const [hData, setHData] = useState<EmbalseDataHistorical[]>([])
  const [liveData, setLiveData] = useState<EmbalseDataLive[]>([])
  const [ContentKey, setContentKey] = useState<string>("")
  const [bottomSheetOpen, SetBottomSheetOpen] = useState<boolean>(false)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState<boolean>(true)
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true)
  const [portugalData, setPortugalData] = useState<EmbalseDataPortugal[]>([])
  const [isLoadingPortugal, setIsLoadingPortugal] = useState<boolean>(false)
  const userId = useStore((state) => state.id)

  const { embalse } = useLocalSearchParams()
  const navigation = useNavigation()
  const emb = Array.isArray(embalse) ? embalse[0] : embalse
  const embalseCoded = Array.isArray(embalse)
    ? embalse[0]?.toLowerCase().replace(/ /g, "-") || ""
    : (embalse || "").toLowerCase().replace(/ /g, "-")
  const { weather: weatherData, loading: weatherLoading, coordinates } = useWeather(emb, embalseCoded)
  useEffect(() => {
    const headerTitle = embalse ? (Array.isArray(embalse) ? embalse[0] : embalse) : "N/D"
    const truncateText = (text: string, maxLength: number = 26) => {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    navigation.setOptions({
      headerLeft: () => (
        <Text
          style={{
            fontSize: 25,
            fontFamily: "Inter-Black",
            color: "#032E15",
            paddingLeft: "auto",
            maxWidth: 600,
            lineHeight: 32,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {truncateText(headerTitle)}
        </Text>
      ),
    })
  }, [embalse, navigation])

  useEffect(() => {
    if (!embalse || !userId) return
    // El userId ya está disponible desde el store, no necesitamos la llamada a getSession
    console.log("User ID from store:", userId)

    const fetchDataAsync = async () => {
      setIsLoadingHistorical(true)
      setIsLoadingLive(true)

      try {
        const isPortugal = coordinates.pais?.toLowerCase().includes("portugal")

        if (isPortugal) {
          setIsLoadingPortugal(true)
          const [portugalResult, liveResult] = await Promise.allSettled([
            PortugalData(embalse, setPortugalData),
            LiveData(embalse, emb, setLiveData),
          ])

          if (portugalResult.status === "rejected") {
            console.error("Error fetching Portugal data:", portugalResult.reason)
            setPortugalData([])
          }
          setIsLoadingPortugal(false)
          setIsLoadingHistorical(false)

          if (liveResult.status === "rejected") {
            console.error("Error fetching live data:", liveResult.reason)
            setLiveData([])
          }
          setIsLoadingLive(false)
        } else {
          const [historicalResult, liveResult] = await Promise.allSettled([
            HistoricalData(embalse, emb, setHData),
            LiveData(embalse, emb, setLiveData),
          ])

          if (historicalResult.status === "rejected") {
            console.error("Error fetching historical data:", historicalResult.reason)
            setHData([])
          }
          setIsLoadingHistorical(false)

          if (liveResult.status === "rejected") {
            console.error("Error fetching live data:", liveResult.reason)
            setLiveData([])
          }
          setIsLoadingLive(false)
        }
      } catch (error) {
        console.error("Unexpected error fetching data:", error)
        setIsLoadingHistorical(false)
        setIsLoadingLive(false)
        setIsLoadingPortugal(false)
      }
    }

    fetchDataAsync()
  }, [embalse, emb, coordinates.pais, userId])

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="mx-3">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-col justify-center gap-1">
            <Text className="font-Inter text-2xl text-[#032E15]">
              {isLoadingHistorical || isLoadingPortugal ? (
                <View className="flex flex-row items-center gap-2">
                  <ActivityIndicator
                    size="small"
                    color="#032E15"
                  />
                  <Text>Cargando...</Text>
                </View>
              ) : portugalData.length > 0 ? (
                `Cuenca del ${portugalData[0].nombre_cuenca}`
              ) : (
                `Cuenca del ${hData && hData.length > 0 ? hData[0].cuenca : "N/A"}`
              )}
            </Text>
            <View className="flex flex-row items-center justify-center gap-2">
              <Calendar />
              <Text className="font-Inter">
                Ult. Actualización -{" "}
                {isLoadingHistorical || isLoadingPortugal
                  ? "Cargando..."
                  : portugalData.length > 0
                    ? new Date(portugalData[0].fecha_modificacion).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : hData && hData.length > 0
                      ? new Date(hData[0].fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
              </Text>
            </View>
          </View>
          <FavButton
            userId={userId}
            embalse={embalse ? (Array.isArray(embalse) ? embalse[0] : embalse) : "N/D"}
            pais={coordinates.pais || "N/D"}
          />
        </View>

        <Resume
          weather={weatherData}
          embalse={
            portugalData.length > 0
              ? {
                  embalse: {
                    name: portugalData[0].nombre_embalse,
                    nivel: portugalData[0].agua_embalsada,
                    porcentaje: portugalData[0].agua_embalsadapor,
                  },
                }
              : !isLoadingHistorical && hData.length > 0
                ? {
                    embalse: {
                      name: hData[0].embalse,
                      nivel: hData[0].volumen_actual,
                      porcentaje: hData[0].porcentaje,
                    },
                  }
                : null
          }
          fish_activity={null}
        />
        <View className="ml-auto flex flex-row items-center justify-center gap-1 text-xs">
          <Ai />
          <Text className="font-Inter">AcuaNet AI puede cometer errores</Text>
        </View>

        <Animated.View className="mt-10 flex flex-col gap-5">
          {portugalData.length === 0 &&
            (!isLoadingLive && liveData.length > 0 ? (
              <Animated.View entering={FadeIn.duration(150)}>
                <TouchableOpacity
                  onPress={() => {
                    setContentKey("livedata")
                    SetBottomSheetOpen(true)
                  }}
                  className="h-fit self-start rounded-2xl border border-[#019FFF]/50 bg-[#bae5ff] p-2"
                >
                  <View className="flex flex-row items-center gap-2">
                    <HugeiconsIcon
                      icon={LiveStreaming02Icon}
                      size={30}
                      color={"#019FFF"}
                    />
                    <Text className="font-Inter text-xl text-[#019FFF]">Datos en Tiempo Real</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : isLoadingLive ? (
              <View className="flex w-full items-center justify-center py-4">
                <ActivityIndicator
                  size="large"
                  color="#019FFF"
                />
                <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando datos en tiempo real...</Text>
              </View>
            ) : null)}

          {portugalData.length > 0 ? (
            !isLoadingPortugal ? (
              <Animated.View entering={FadeIn.duration(150)}>
                <TouchableOpacity
                  onPress={() => {
                    setContentKey("weekdata")
                    SetBottomSheetOpen(true)
                  }}
                  className="h-fit self-start rounded-2xl border border-[#008F06]/50 bg-[#BAFFBD] p-2"
                >
                  <View className="flex flex-row items-center gap-2">
                    <HugeiconsIcon
                      icon={CalendarCheckIn01Icon}
                      size={30}
                      color={"#008F06"}
                    />
                    <Text className="font-Inter text-xl text-[#008F06]">Datos Semanales</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View className="flex w-full items-center justify-center py-4">
                <ActivityIndicator
                  size="large"
                  color="#008F06"
                />
                <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando datos semanales...</Text>
              </View>
            )
          ) : !isLoadingHistorical && hData.length > 0 ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("weekdata")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#008F06]/50 bg-[#BAFFBD] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={CalendarCheckIn01Icon}
                    size={30}
                    color={"#008F06"}
                  />
                  <Text className="font-Inter text-xl text-[#008F06]">Datos Semanales</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : isLoadingHistorical ? (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#008F06"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando datos semanales...</Text>
            </View>
          ) : null}

          {portugalData.length === 0 &&
            (!isLoadingHistorical && hData.length > 0 ? (
              <Animated.View entering={FadeIn.duration(150)}>
                <TouchableOpacity
                  onPress={() => {
                    setContentKey("historicaldata")
                    SetBottomSheetOpen(true)
                  }}
                  className="h-fit self-start rounded-2xl border border-[#C09400]/50 bg-[#EFFFBA] p-2"
                >
                  <View className="flex flex-row items-center gap-2">
                    <HugeiconsIcon
                      icon={ChartLineData02FreeIcons}
                      size={30}
                      color={"#C09400"}
                    />
                    <Text className="font-Inter text-xl text-[#C09400]">Datos Historicos</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : isLoadingHistorical ? (
              <View className="flex w-full items-center justify-center py-4">
                <ActivityIndicator
                  size="large"
                  color="#C09400"
                />
                <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando datos históricos...</Text>
              </View>
            ) : null)}

          {!weatherLoading ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("weatherForecast")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#9000FF]/50 bg-[#E1BAFF] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={RainbowIcon}
                    size={30}
                    color={"#9000FF"}
                  />
                  <Text className="font-Inter text-xl text-[#9000FF]">Predicción Meteorológica</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#9000FF"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando predicción meteorológica...</Text>
            </View>
          )}

          {portugalData.length > 0 ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("maps")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#FF8900]/50 bg-[#FFDFBA] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={MapsLocation01Icon}
                    size={30}
                    color={"#FF8900"}
                  />
                  <Text className="font-Inter text-xl text-[#FF8900]">Mapas: Topográfico y de Viento</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : !isLoadingHistorical && hData.length > 0 ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("maps")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#FF8900]/50 bg-[#FFDFBA] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={MapsLocation01Icon}
                    size={30}
                    color={"#FF8900"}
                  />
                  <Text className="font-Inter text-xl text-[#FF8900]">Mapas: Topográfico y de Viento</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : isLoadingHistorical ? (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#FF8900"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando mapas...</Text>
            </View>
          ) : null}

          {portugalData.length > 0 ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("lunarTable")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#0051FF]/50 bg-[#BAD0FF] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={MoonIcon}
                    size={30}
                    color={"#0051FF"}
                  />
                  <Text className="font-Inter text-xl text-[#0051FF]">Tabla Lunar</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : !isLoadingHistorical && hData.length > 0 ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <TouchableOpacity
                onPress={() => {
                  setContentKey("lunarTable")
                  SetBottomSheetOpen(true)
                }}
                className="h-fit self-start rounded-2xl border border-[#0051FF]/50 bg-[#BAD0FF] p-2"
              >
                <View className="flex flex-row items-center gap-2">
                  <HugeiconsIcon
                    icon={MoonIcon}
                    size={30}
                    color={"#0051FF"}
                  />
                  <Text className="font-Inter text-xl text-[#0051FF]">Tabla Lunar</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : isLoadingHistorical ? (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#0051FF"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando tabla lunar...</Text>
            </View>
          ) : null}
        </Animated.View>
      </View>
      <BottomSheetModalComponent
        open={bottomSheetOpen}
        setOpen={SetBottomSheetOpen}
        PortugalData={portugalData}
        contentKey={ContentKey}
        setContentKey={setContentKey}
        LiveData={liveData && liveData.length > 0 ? liveData : []}
        HistoricalData={hData && hData.length > 0 ? hData : []}
        weatherData={weatherData}
        coords={
          coordinates.lat !== null && coordinates.lng !== null
            ? { latitude: coordinates.lat, longitude: coordinates.lng, pais: coordinates.pais }
            : undefined
        }
      />
    </>
  )
}
