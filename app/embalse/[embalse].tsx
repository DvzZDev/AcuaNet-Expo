/* eslint-disable react-hooks/exhaustive-deps */
import type { EmbalseDataHistorical, EmbalseDataLive } from "../../types"
import { Stack, useLocalSearchParams } from "expo-router"
import { HistoricalData, LiveData } from "querys"
import { useEffect, useState } from "react"
import { ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet, Text, View } from "react-native"
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
  StarIcon,
} from "@hugeicons/core-free-icons"
import Animated, { FadeIn } from "react-native-reanimated"
import BottomSheetModalComponent from "components/Embalse/BottomSheet/BottomSheet"
import { useWeather } from "lib/getWeather"

export default function Embalse() {
  const [hData, setHData] = useState<EmbalseDataHistorical[]>([])
  const [liveData, setLiveData] = useState<EmbalseDataLive[]>([])
  const [ContentKey, setContentKey] = useState<string>("")
  const [bottomSheetOpen, SetBottomSheetOpen] = useState(false)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(true)
  const [isLoadingLive, setIsLoadingLive] = useState(true)

  const { embalse } = useLocalSearchParams()
  const emb = Array.isArray(embalse) ? embalse[0] : embalse
  const embalseCoded = Array.isArray(embalse)
    ? embalse[0]?.toLowerCase().replace(/ /g, "-") || ""
    : (embalse || "").toLowerCase().replace(/ /g, "-")
  const { weather: weatherData, loading: weatherLoading, coordinates } = useWeather(emb, embalseCoded)

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setIsLoadingHistorical(true)
        setIsLoadingLive(true)

        const historicalPromise = HistoricalData(embalse, emb, setHData)
          .then(() => setIsLoadingHistorical(false))
          .catch((error) => {
            console.error("Error fetching historical data:", error)
            setHData([])
            setIsLoadingHistorical(false)
          })

        const livePromise = LiveData(embalse, emb, setLiveData)
          .then(() => setIsLoadingLive(false))
          .catch((error) => {
            console.error("Error fetching live data:", error)
            setLiveData([])
            setIsLoadingLive(false)
          })

        await Promise.all([historicalPromise, livePromise])
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoadingHistorical(false)
        setIsLoadingLive(false)
      }
    }
    fetchDataAsync()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "#effcf3",
          },
          headerBackVisible: true,
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => "",
          headerLeft: () => {
            const headerTitle = embalse ? (Array.isArray(embalse) ? embalse[0] : embalse) : "N/D"
            const truncateText = (text: string, maxLength: number = 26) => {
              return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
            }

            return (
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
            )
          },
        }}
      />
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="mx-3">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-col justify-center gap-1">
            <Text className="font-Inter text-2xl text-[#032E15]">
              {isLoadingHistorical ? (
                <View className="flex flex-row items-center gap-2">
                  <ActivityIndicator
                    size="small"
                    color="#032E15"
                  />
                  <Text>Cargando...</Text>
                </View>
              ) : (
                `Cuanca del ${hData && hData.length > 0 ? hData[0].cuenca : "N/A"}`
              )}
            </Text>
            <View className="flex flex-row items-center justify-center gap-2">
              <Calendar />
              <Text className="font-Inter">
                Ult. Actualización -{" "}
                {isLoadingHistorical
                  ? "Cargando..."
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
          <HugeiconsIcon
            icon={StarIcon}
            size={40}
            fill="yellow"
            color={"orange"}
          />
        </View>

        <View className="mt-5 h-[12rem] w-full rounded-lg bg-green-300 p-2">
          <ScrollView>
            <Text className="font-Inter text-base">
              En los próximos días, el embalse de Orellana se mantiene alto, al 86%, lo que podría influir en el acceso
              a algunas zonas de pesca. La fase lunar será favorable con actividad alta. El clima será mayormente
              soleado y caluroso, con temperaturas máximas que superarán los 30°C a partir del domingo. El viento
              soplará con fuerza el jueves y viernes, especialmente por la tarde, pero disminuirá gradualmente durante
              el fin de semana.
            </Text>
          </ScrollView>
        </View>
        <View className="ml-auto flex flex-row items-center justify-center gap-1 text-xs">
          <Ai />
          <Text className="font-Inter">AcuaNet AI puede cometer errores</Text>
        </View>

        <Animated.View className="mt-10 flex flex-col gap-5">
          {!isLoadingLive && liveData.length > 0 ? (
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
          ) : null}

          {!isLoadingHistorical && hData.length > 0 ? (
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

          {!isLoadingHistorical && hData.length > 0 ? (
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
          ) : null}

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

          {!isLoadingHistorical && hData.length > 0 ? (
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

          {!isLoadingHistorical && hData.length > 0 ? (
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
        contentKey={ContentKey}
        setContentKey={setContentKey}
        LiveData={liveData && liveData.length > 0 ? liveData : []}
        HistoricalData={hData && hData.length > 0 ? hData : []}
        weatherData={weatherData}
        coords={
          coordinates.lat !== null && coordinates.lng !== null
            ? { latitude: coordinates.lat, longitude: coordinates.lng }
            : undefined
        }
      />
    </>
  )
}
