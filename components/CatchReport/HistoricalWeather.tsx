import { View, Text, Image } from "react-native"
import React, { useMemo } from "react"
import { WeatherData } from "types/index"
import { findClosestHour } from "../../lib/findClosestHour"
import { getWeatherIcon } from "../../lib/getWeatherIconImage"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { FastWindIcon, TimeQuarterIcon } from "@hugeicons/core-free-icons"

interface HistoricalWeatherProps {
  weatherData: WeatherData
  fecha: string
}

export default function HistoricalWeather({ weatherData, fecha }: HistoricalWeatherProps) {
  const closestHourData = useMemo(() => {
    return findClosestHour(weatherData, fecha)
  }, [weatherData, fecha])

  return (
    <View className="mt-8">
      <View className="mb-3 self-start rounded-2xl bg-[#f8e7fd] px-2 py-1">
        <Text className="font-Inter-SemiBold text-lg text-[#c501ff]">
          Meteorologia{" "}
          {new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </View>

      <View className="h-fit w-full rounded-2xl bg-pink-50">
        <View className="w-full gap-1 border-b border-pink-600 p-3">
          <Text className="font-Inter-Bold text-lg text-pink-800">
            A las{" "}
            {new Date(fecha).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            la temperatura era:
          </Text>
          <View className="w-full flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              {closestHourData?.icon && (
                <View className="rounded-xl bg-pink-950 p-1">
                  <Image
                    source={getWeatherIcon(closestHourData.icon)}
                    className="h-8 w-8"
                  />
                </View>
              )}
              <View>
                <Text className="font-Inter-Bold text-2xl text-pink-950">
                  {closestHourData?.temp ? `${closestHourData.temp}°C` : "N/A"}
                </Text>
                <Text className="font-Inter text-base text-pink-600">
                  {closestHourData?.conditions || "No data available"}
                </Text>
              </View>
            </View>
            <View className="flex-col gap-1">
              <View className="flex-row items-center gap-1">
                <HugeiconsIcon
                  icon={FastWindIcon}
                  size={20}
                  color="#db2777"
                />
                <Text className="font-Inter text-base text-pink-600">
                  {closestHourData?.windspeed ? `${closestHourData.windspeed} km/h` : "N/A"}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <HugeiconsIcon
                  icon={TimeQuarterIcon}
                  size={20}
                  color="#db2777"
                />
                <Text className="font-Inter text-base text-pink-600">
                  {closestHourData?.pressure ? `${closestHourData.pressure} hPa` : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="w-full gap-1 p-3">
          <Text className="font-Inter-Bold text-lg text-pink-800">Condiciones previstas para este día:</Text>
          <View className="w-full flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="rounded-xl bg-pink-950 p-1">
                <Image
                  source={require("../../assets/weather-icons/clear-day.png")}
                  className="h-8 w-8"
                />
              </View>
              <View>
                <Text className="font-Inter-Bold text-2xl text-pink-950">
                  {weatherData?.days?.[0]?.tempmax ? `${weatherData.days[0].tempmax}°C` : "N/A"} /{" "}
                  {weatherData?.days?.[0]?.tempmin ? `${weatherData.days[0].tempmin}°C` : "N/A"}
                </Text>
                <Text className="font-Inter text-base text-pink-600">Máx / Mín previstas</Text>
              </View>
            </View>
            <View className="flex-col gap-1">
              <View className="flex-row items-center gap-1">
                <HugeiconsIcon
                  icon={FastWindIcon}
                  size={20}
                  color="#db2777"
                />
                <Text className="font-Inter text-base text-pink-600">
                  {weatherData?.days?.[0]?.windspeed ? `${weatherData.days[0].windspeed} km/h` : "N/A"}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <HugeiconsIcon
                  icon={TimeQuarterIcon}
                  size={20}
                  color="#db2777"
                />
                <Text className="font-Inter text-base text-pink-600">
                  {weatherData?.days?.[0]?.pressure ? `${weatherData.days[0].pressure} hPa` : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
