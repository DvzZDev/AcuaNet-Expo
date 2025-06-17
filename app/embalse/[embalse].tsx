import { useLocalSearchParams, useNavigation } from "expo-router"
import { useHistoricalData, useLiveData, usePortugalData } from "querys"
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
  const navigation = useNavigation()
  const { embalse } = useLocalSearchParams()
  const emb = Array.isArray(embalse) ? embalse.join(",") : embalse || ""
  const embalseCoded = emb.toLowerCase().replace(/ /g, "-")
  const userId = useStore((state) => state.id)

  const [ContentKey, setContentKey] = useState<string>("")
  const [bottomSheetOpen, SetBottomSheetOpen] = useState<boolean>(false)

  const { weather: weatherData, loading: weatherLoading, coordinates } = useWeather(emb, embalseCoded)
  const isPortugal = coordinates.pais?.toLowerCase().includes("portugal")
  const { data: LiveDataT, isLoading: isLoadingLive } = useLiveData(emb, isPortugal)
  const { data: historicalData, isLoading: isLoadingHistorical } = useHistoricalData(emb, isPortugal)
  const { data: portugalData, isLoading: isLoadingPortugal } = usePortugalData(emb, isPortugal)

  useEffect(() => {
    const headerTitle = emb || "N/D"
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
  }, [emb, navigation])

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
              ) : portugalData && portugalData.length > 0 ? (
                `Cuenca del ${portugalData[0].nombre_cuenca}`
              ) : (
                `Cuenca del ${historicalData && Array.isArray(historicalData) && historicalData.length > 0 ? historicalData[0].cuenca : "N/A"}`
              )}
            </Text>
            <View className="flex flex-row items-center justify-center gap-2">
              <Calendar />
              <Text className="font-Inter">
                Ult. Actualización -{" "}
                {isLoadingHistorical || isLoadingPortugal
                  ? "Cargando..."
                  : portugalData && portugalData.length > 0
                    ? new Date(portugalData[0].fecha_modificacion).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : historicalData && Array.isArray(historicalData) && historicalData.length > 0
                      ? new Date(historicalData[0].fecha).toLocaleDateString("es-ES", {
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
            embalse={emb}
            pais={coordinates.pais || "N/D"}
          />
        </View>

        <Resume
          weather={weatherData}
          embalse={
            portugalData && portugalData.length > 0
              ? {
                  embalse: {
                    name: portugalData[0].nombre_embalse,
                    nivel: portugalData[0].agua_embalsada,
                    porcentaje: portugalData[0].agua_embalsadapor,
                  },
                }
              : !isLoadingHistorical && historicalData && Array.isArray(historicalData) && historicalData.length > 0
                ? {
                    embalse: {
                      name: historicalData[0].embalse,
                      nivel: historicalData[0].volumen_actual,
                      porcentaje: historicalData[0].porcentaje,
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
          {/* Datos en Tiempo Real - Solo para España */}
          {!isPortugal &&
            (!isLoadingLive && LiveDataT && LiveDataT.length > 0 ? (
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

          {/* Datos Semanales - Para Portugal */}
          {isPortugal &&
            (!isLoadingPortugal && portugalData && portugalData.length > 0 ? (
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
            ) : isLoadingPortugal ? (
              <View className="flex w-full items-center justify-center py-4">
                <ActivityIndicator
                  size="large"
                  color="#008F06"
                />
                <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando datos semanales...</Text>
              </View>
            ) : null)}

          {/* Datos Semanales - Para España cuando hay datos históricos */}
          {!isPortugal &&
            (!isLoadingHistorical && historicalData && Array.isArray(historicalData) && historicalData.length > 0 ? (
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
            ) : null)}

          {/* Datos Históricos - Solo para España */}
          {!isPortugal &&
            (!isLoadingHistorical && historicalData && Array.isArray(historicalData) && historicalData.length > 0 ? (
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

          {/* Predicción Meteorológica - Para todos */}
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

          {/* Mapas - Para todos cuando hay datos */}
          {(isPortugal && portugalData && portugalData.length > 0) ||
          (!isPortugal &&
            !isLoadingHistorical &&
            historicalData &&
            Array.isArray(historicalData) &&
            historicalData.length > 0) ? (
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
          ) : !isPortugal && isLoadingHistorical ? (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#FF8900"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando mapas...</Text>
            </View>
          ) : null}

          {/* Tabla Lunar - Para todos cuando hay datos */}
          {(isPortugal && portugalData && portugalData.length > 0) ||
          (!isPortugal &&
            !isLoadingHistorical &&
            historicalData &&
            Array.isArray(historicalData) &&
            historicalData.length > 0) ? (
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
          ) : !isPortugal && isLoadingHistorical ? (
            <View className="flex w-full items-center justify-center py-4">
              <ActivityIndicator
                size="large"
                color="#0051FF"
              />
              <Text className="mt-2 font-Inter text-sm text-gray-600">Cargando tabla lunar...</Text>
            </View>
          ) : null}

          {/* Mensaje cuando no hay datos disponibles */}
          {!isLoadingLive &&
            !isLoadingHistorical &&
            !isLoadingPortugal &&
            !weatherLoading &&
            ((!isPortugal &&
              (!LiveDataT || LiveDataT.length === 0) &&
              (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0)) ||
              (isPortugal && (!portugalData || portugalData.length === 0))) && (
              <Animated.View entering={FadeIn.duration(150)}>
                <View className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
                  <Text className="text-center font-Inter text-gray-600">
                    No hay datos disponibles para este embalse en este momento.
                  </Text>
                </View>
              </Animated.View>
            )}
        </Animated.View>
      </View>
      <BottomSheetModalComponent
        embalse={emb}
        codedEmbalse={embalseCoded}
        open={bottomSheetOpen}
        setOpen={SetBottomSheetOpen}
        PortugalData={portugalData ? portugalData : []}
        contentKey={ContentKey}
        setContentKey={setContentKey}
        LiveData={LiveDataT && LiveDataT.length > 0 ? LiveDataT : []}
        HistoricalData={historicalData && Array.isArray(historicalData) ? historicalData : []}
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
