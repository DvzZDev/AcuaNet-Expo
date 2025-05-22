import React, { useState } from "react"
import { LineChart, yAxisSides } from "react-native-gifted-charts"
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler"

import type { WeatherData } from "types"
import { getWeatherIcon } from "../../lib/weatherIcon"
import { BlurView } from "expo-blur"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons"
import { LinearGradient, Stop } from "react-native-svg"

export default function Weather({ data }: { data: WeatherData | null | undefined }) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [active, setActive] = useState(false)
  const chartWidth = Dimensions.get("window").width - 75
  const targetDate = data?.days.find((day) => day.datetime === selectedDay)
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
    <>
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
                              source={{
                                uri: Image.resolveAssetSource(getWeatherIcon(h.icon)).uri,
                                cache: "force-cache",
                              }}
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
                              source={{
                                uri: Image.resolveAssetSource(getWeatherIcon(h.icon)).uri,
                                cache: "force-cache",
                              }}
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
                    <View key={i}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDay(day.datetime)
                          setActive(true)
                        }}
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
                            source={{
                              uri: Image.resolveAssetSource(getWeatherIcon(day.icon)).uri,
                              cache: "force-cache",
                            }}
                            style={{ width: 30, height: 30 }}
                          />
                        </View>
                        <Text className="text-md font-Inter-SemiBold text-pink-200/60">{day.tempmin.toFixed(0)}º</Text>
                        <Text className="text-md font-Inter-SemiBold text-pink-200">{day.tempmax.toFixed(0)}º</Text>
                        <Text className="text-md font-Inter-SemiBold text-teal-100">
                          {day.windspeed.toFixed(0)} <Text className="text-xs">km/h</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </GestureHandlerRootView>
        </View>
      </View>

      {active && (
        <Animated.View
          entering={ZoomIn.duration(150)}
          exiting={ZoomOut.duration(150)}
          className="absolute inset-0 z-20"
        >
          <BlurView
            intensity={300}
            className="absolute inset-0"
          />
          <View className="relative flex h-[34rem] w-full items-center rounded-xl bg-[#380063] px-4 py-7 shadow-lg">
            <TouchableOpacity
              className="absolute right-2 top-4 z-10 p-1"
              onPress={() => setActive(false)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 50 }}
            >
              <HugeiconsIcon
                icon={ArrowTurnBackwardIcon}
                size={22}
                color="pink"
              />
            </TouchableOpacity>
            <View>
              <Text className="font-Inter-SemiBold text-xl text-pink-200">
                {targetDate &&
                  (() => {
                    const fecha = new Date(targetDate.datetime).toLocaleString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    return fecha.charAt(0).toUpperCase() + fecha.slice(1)
                  })()}
              </Text>
            </View>
            <View className="mt-7 h-fit w-full flex-row items-center gap-1">
              <Text className="font-Inter-SemiBold text-4xl text-pink-200">{targetDate?.tempmax.toFixed(0)}º</Text>
              <Text className="font-Inter-SemiBold text-4xl text-pink-200/70">{targetDate?.tempmin.toFixed(0)}º</Text>
              <Image
                source={{
                  uri: Image.resolveAssetSource(getWeatherIcon(targetDate?.icon || "default")).uri,
                  cache: "force-cache",
                }}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <Text className="w-full font-Inter-Medium text-base text-pink-100">Celsius (ºC)</Text>

            <View className="h-fit w-full">
              <LineChart
                data={
                  targetDate?.hours?.map((h) => ({
                    value: h.temp,
                    icon: h.icon,
                    date: h.datetime,
                    labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                  })) || []
                }
                overflowTop={50}
                rulesType="solid"
                rulesColor="rgba(201, 159, 183, 0.2)"
                rulesThickness={1}
                showYAxisIndices={true}
                yAxisIndicesHeight={2}
                curved
                lineGradientDirection="vertical"
                lineGradientStartColor="#f556b0"
                lineGradientEndColor="#c99fb7"
                thickness={5}
                disableScroll
                color="#f556b0"
                yAxisIndicesWidth={10}
                verticalLinesColor={"rgba(201, 159, 183, 0.2)"}
                verticalLinesThickness={1}
                xAxisColor={"#fff"}
                yAxisColor={"#fff"}
                areaChart
                areaGradientId="ggrd"
                isAnimated
                areaGradientComponent={() => {
                  return (
                    <LinearGradient
                      id="ggrd"
                      x1="0"
                      y1="1"
                      x2="0"
                      y2="0"
                    >
                      <Stop
                        offset="0"
                        stopColor={"#ffe4fa"}
                        stopOpacity={0.2}
                      />
                      <Stop
                        offset="0.8"
                        stopColor={"#a4547e"}
                        stopOpacity={0.7}
                      />
                      <Stop
                        offset="1"
                        stopColor={"#66003a"}
                      />
                    </LinearGradient>
                  )
                }}
                hideDataPoints
                initialSpacing={5}
                adjustToWidth
                endSpacing={10}
                width={chartWidth}
                height={250}
                yAxisLabelSuffix="º"
                yAxisSide={yAxisSides.RIGHT}
                yAxisTextStyle={{ color: "#c99fb7", fontFamily: "Inter" }}
                xAxisLabelTexts={
                  targetDate?.hours?.map((h) => {
                    const hour = parseInt(h.datetime.slice(0, 2))
                    return [0, 6, 12, 18].includes(hour) ? h.datetime.slice(0, 5) : ""
                  }) || []
                }
                maxValue={45}
                stepValue={5}
                pointerConfig={{
                  pointerStripHeight: 160,
                  pointerStripColor: "#c99fb7",
                  pointerStripWidth: 2,
                  hidePointers: false,
                  stripOverPointer: true,
                  pointerColor: "#f556b0",
                  radius: 6,
                  pointerLabelWidth: 100,
                  pointerLabelHeight: 90,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: true,
                  pointerLabelComponent: (items: any) => {
                    return (
                      <View className="mt-[-4rem] h-fit w-[8.6rem] justify-center">
                        <View className="flex-col items-center justify-center gap-1 rounded-xl bg-[#23053a] p-3">
                          <Text className="mb-1.5 text-center font-Inter-SemiBold text-lg text-pink-200/60">
                            {items[0].date.slice(0, 5)}
                          </Text>

                          <View className="flex-row items-center justify-center gap-1">
                            <Image
                              source={{
                                uri: Image.resolveAssetSource(getWeatherIcon(items[0].icon)).uri,
                                cache: "force-cache",
                              }}
                              style={{ width: 40, height: 40 }}
                            />
                            <Text className="font-Inter-Bold text-4xl text-pink-200">{items[0].value.toFixed(0)}º</Text>
                          </View>
                        </View>
                      </View>
                    )
                  },
                }}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </>
  )
}
