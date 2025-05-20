import React from "react"
import { Image, Text, View } from "react-native"
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler"

import type { WeatherData } from "types"
import { getWeatherIcon } from "../../lib/weatherIcon"

export default function Weather({ data }: { data: WeatherData | null | undefined }) {
  console.log("Weather data:", data)
  // Verificar si data existe
  if (!data || !data.days || data.days.length === 0) {
    return (
      <View className="h-fit w-full">
        <View className="mt-4 h-fit w-full rounded-2xl bg-[#380063] p-4">
          <Text className="text-center font-Inter-Medium text-pink-200">No hay datos meteorológicos disponibles</Text>
        </View>
      </View>
    )
  }

  // Extraer datos del día actual
  const currentDay = data.days[0]
  const sunrise = currentDay.sunrise
  const sunset = currentDay.sunset

  // Convertir hora de sunrise y sunset a formato numérico para comparación
  const sunriseHour = parseInt(sunrise.slice(0, 2))
  const sunsetHour = parseInt(sunset.slice(0, 2))

  return (
    <View className="h-fit w-full">
      <View className="mt-4 h-fit w-full rounded-2xl bg-[#380063]">
        <View className="text-bg-pink-200 mb-3 h-fit w-fit items-center justify-center rounded-md rounded-t-2xl bg-[#7636a6] p-2">
          <Text className="font-Inter-Medium text-pink-200">{data.days[0].description}</Text>
        </View>
        <GestureHandlerRootView style={{ width: "100%", height: "auto" }}>
          <ScrollView
            className="h-fit w-full"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="ml-2 flex flex-row gap-6 ">
              {data.days[0].hours &&
                data.days[0].hours.map((h, i) => {
                  const hour = parseInt(h.datetime.slice(0, 2))

                  if (i > 0 && hour === sunriseHour) {
                    return (
                      <React.Fragment key={`hour-${i}`}>
                        <View className="flex items-center justify-center gap-2">
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{sunrise.slice(0, 5)}</Text>
                          <Image
                            source={{
                              uri: Image.resolveAssetSource(getWeatherIcon("sunrise")).uri,
                              cache: "force-cache",
                            }}
                            style={{ width: 30, height: 30 }}
                          />
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">Amanecer</Text>
                        </View>
                        <View className="flex items-center justify-center gap-2">
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{hour}</Text>
                          <Image
                            source={{ uri: Image.resolveAssetSource(getWeatherIcon(h.icon)).uri, cache: "force-cache" }}
                            style={{ width: 30, height: 30 }}
                          />
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{h.temp.toFixed(0)}º</Text>
                        </View>
                      </React.Fragment>
                    )
                  }

                  if (i > 0 && hour === sunsetHour) {
                    return (
                      <React.Fragment key={`hour-${i}`}>
                        <View className="flex items-center justify-center gap-2">
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{sunset.slice(0, 5)}</Text>
                          <Image
                            source={{
                              uri: Image.resolveAssetSource(getWeatherIcon("sunset")).uri,
                              cache: "force-cache",
                            }}
                            style={{ width: 30, height: 30 }}
                          />
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">Atardecer</Text>
                        </View>
                        <View className="flex items-center justify-center gap-2">
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{hour}</Text>
                          <Image
                            source={{ uri: Image.resolveAssetSource(getWeatherIcon(h.icon)).uri, cache: "force-cache" }}
                            style={{ width: 30, height: 30 }}
                          />
                          <Text className="mt-1 font-Inter-Medium text-sm text-white">{h.temp.toFixed(0)}º</Text>
                        </View>
                      </React.Fragment>
                    )
                  }

                  return (
                    <View
                      key={i}
                      className="flex items-center justify-center gap-2"
                    >
                      <Text className="mt-1 font-Inter-Medium text-sm text-white">{i === 0 ? "Ahora" : hour}</Text>
                      <Image
                        source={{ uri: Image.resolveAssetSource(getWeatherIcon(h.icon)).uri, cache: "force-cache" }}
                        style={{ width: 30, height: 30 }}
                      />
                      <Text className="mt-1 font-Inter-Medium text-sm text-white">{h.temp.toFixed(0)}º</Text>
                    </View>
                  )
                })}
            </View>
          </ScrollView>
        </GestureHandlerRootView>
        <GestureHandlerRootView style={{ width: "100%", height: 280 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-[20rem] w-full"
          >
            <View className="mt-5">
              {data.days &&
                data.days.map((day, i) => (
                  <View
                    key={i}
                    className="flex-row items-center justify-around border-t border-[#6412a3] py-3"
                  >
                    <Text className="text-md font-Inter-Bold text-pink-200">
                      {i === 0
                        ? "Hoy"
                        : new Date(day.datetime)
                            .toLocaleString("es-ES", { weekday: "short" })
                            .replace(/^./, (c) => c.toUpperCase())}
                    </Text>
                    <View>
                      <Image
                        source={{ uri: Image.resolveAssetSource(getWeatherIcon(day.icon)).uri, cache: "force-cache" }}
                        style={{ width: 30, height: 30 }}
                      />
                    </View>
                    <Text className="text-md font-Inter-SemiBold text-pink-200/60">{day.tempmin.toFixed(0)}º</Text>
                    <Text className="text-md font-Inter-SemiBold text-pink-200">{day.temp.toFixed(0)}º</Text>
                    <Text className="text-md font-Inter-SemiBold text-teal-100">
                      {day.windspeed.toFixed(0)} <Text className="text-xs">km/h</Text>
                    </Text>
                  </View>
                ))}
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </View>
    </View>
  )
}
