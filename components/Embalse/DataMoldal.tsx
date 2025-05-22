import { ChartLineData02FreeIcons, LiveStreaming02Icon, RainbowIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { BlurView } from "expo-blur"
import LiveDataTable from "./ContentModal/LiveDataTable"
import { Modal, TouchableOpacity, View, StyleSheet, Text } from "react-native"
import { twMerge } from "tailwind-merge"
import Weather from "./Weather"
import type { EmbalseDataLive, EmbalseDataHistorical } from "types"
import WeekData from "./ContentModal/WeekData"
import Chart from "./ContentModal/Chart"

interface DataModalProps {
  LiveData?: EmbalseDataLive[] | null
  HistoricalData?: EmbalseDataHistorical[] | null
  isOpen: boolean
  contentKey: string
  setIsOpen: (isOpen: boolean) => void
  setContentKey: (contentKey: string) => void
  Location: string
  weatherData?: any
}

export default function DataModal({
  weatherData,
  LiveData,
  HistoricalData,
  isOpen,
  setIsOpen,
  setContentKey,
  contentKey,
}: DataModalProps) {
  if (!isOpen) return null
  // Ensure arrays are not null
  const liveData = LiveData ?? []
  const historicalData = HistoricalData ?? []

  const title =
    contentKey === "livedata"
      ? "Datos en Tiempo Real"
      : contentKey === "weekdata"
        ? "Datos Semanales"
        : contentKey === "historicaldata"
          ? "Datos Históricos"
          : contentKey === "weatherForecast"
            ? "Predicción Meteorológica"
            : "Datos"
  const wildcard =
    contentKey === "livedata" ? "Datos no contrastados" : contentKey === "weekdata" ? "Datos Contrastados" : null
  const icon =
    contentKey === "livedata"
      ? LiveStreaming02Icon
      : contentKey === "weekdata"
        ? ChartLineData02FreeIcons
        : contentKey === "historicaldata"
          ? ChartLineData02FreeIcons
          : contentKey === "weatherForecast"
            ? RainbowIcon
            : null
  const iconColor =
    contentKey === "livedata"
      ? "#019FFF"
      : contentKey === "weekdata"
        ? "#008f00"
        : contentKey === "historicaldata"
          ? "#C09400"
          : contentKey === "weatherForecast"
            ? "#9000FF"
            : ""
  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      className="flex items-center justify-center"
      transparent={true}
      onRequestClose={() => {
        setIsOpen(false)
        setTimeout(() => {
          setContentKey("")
        }, 300)
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center p-2"
        onPressOut={() => {
          setIsOpen(false)
          setTimeout(() => {
            setContentKey("")
          }, 300)
        }}
        style={{ flex: 1 }}
      >
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <View
          className={twMerge(
            "h-fit w-full rounded-xl p-3",
            contentKey === "livedata"
              ? "bg-[#003352]/80"
              : contentKey === "weekdata"
                ? "bg-[#dbfce7]/80"
                : contentKey === "historicaldata"
                  ? "bg-[#141602]/80"
                  : contentKey === "weatherForecast"
                    ? "bg-[#270541]/80"
                    : "bg-gray-700"
          )}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => {
            e.stopPropagation()
          }}
        >
          {/* Title */}
          <View className="flex flex-row gap-2">
            <View
              className={twMerge(
                "h-fit self-start rounded-lg border p-1",
                contentKey === "livedata"
                  ? "border-[#019FFF]/50 bg-[#bae5ff]"
                  : contentKey === "weekdata"
                    ? "border-[#008F06]/50 bg-[#baffbd]"
                    : contentKey === "historicaldata"
                      ? "border-[#C09400]/50 bg-[#EFFFBA]"
                      : contentKey === "weatherForecast"
                        ? "border-[#9000FF]/50 bg-[#E1BAFF]"
                        : ""
              )}
            >
              <View className="flex flex-row items-center gap-2">
                <HugeiconsIcon
                  icon={icon}
                  size={20}
                  color={iconColor}
                />
                <Text
                  className={twMerge(
                    "font-Inter text-base text-[#019FFF]",
                    contentKey === "weekdata"
                      ? "text-[#008F06]"
                      : contentKey === "livedata"
                        ? "text-[#019FFF]"
                        : contentKey === "historicaldata"
                          ? "text-[#C09400]"
                          : contentKey === "weatherForecast"
                            ? "text-[#9000FF]"
                            : "text-[#D9F5FF]"
                  )}
                >
                  {title}
                </Text>
              </View>
            </View>

            {/* Wildcard */}
            <View
              className={twMerge(
                "mt-auto h-fit self-start rounded-lg border border-[#FF8800]/50 bg-[#FFD6A7] px-1",
                contentKey === "livedata"
                  ? "border-[#FF8800]/50 bg-[#FFD6A7]"
                  : contentKey === "weekdata"
                    ? "border-[#0072FF]/50 bg-[#BEDBFF]"
                    : "hidden"
              )}
            >
              <View className="flex flex-row items-center gap-2">
                <Text
                  className={twMerge(
                    "font-Inter text-sm text-[#FF8800]",
                    contentKey === "weekdata"
                      ? "text-[#008F06]"
                      : contentKey === "livedata"
                        ? "text-[#FF8800]"
                        : "text-[#D9F5FF]"
                  )}
                >
                  {wildcard}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Livc Data */}
          <LiveDataTable
            liveData={liveData}
            contentKey={contentKey}
          />

          {/* Week data */}
          <WeekData
            liveData={liveData}
            historicalData={historicalData}
            contentKey={contentKey}
          />

          {/* Historical Data */}
          {contentKey === "historicaldata" && historicalData.length > 0 ? (
            <Chart data={historicalData} />
          ) : contentKey === "historicaldata" ? (
            <View className="mt-4 p-2">
              <Text className="text-center font-Inter text-base text-white">No hay datos históricos disponibles</Text>
            </View>
          ) : null}

          {/* Weather Forecast */}
          {contentKey === "weatherForecast" && weatherData ? (
            <Weather data={weatherData ?? null} />
          ) : contentKey === "weatherForecast" ? (
            <View className="mt-4 p-2">
              <Text className="text-center font-Inter text-base text-white">
                No hay datos meteorológicos disponibles
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Modal>
  )
}
