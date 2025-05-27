import React, { useState } from "react"
import { LineChart, yAxisSides } from "react-native-gifted-charts"
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeInUp, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated"
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler"
import SegmentedControl from "@react-native-segmented-control/segmented-control"

import type { WeatherData } from "types"
import { getWeatherIcon } from "../../lib/weatherIcon"
import { BlurView } from "expo-blur"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { ArrowTurnBackwardIcon, SunCloud02Icon } from "@hugeicons/core-free-icons"
import { LinearGradient, Stop } from "react-native-svg"
import DropDown from "../Embalse/ContentModal/Dropdown"

// Use toISOString and replace hyphens with slashes
export default function Weather({ data }: { data: WeatherData | null | undefined }) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [active, setActive] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedDropDown, setSelectedDropDown] = useState<[string, any]>(["Condiciones", SunCloud02Icon])
  const chartWidth = Dimensions.get("window").width - 65
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

  // DropDrown content

  // Convertir hora de sunrise y sunset a formato numérico para comparación
  const sunriseHour = parseInt(sunrise.slice(0, 2))
  const sunsetHour = parseInt(sunset.slice(0, 2))

  return (
    <>
      <View className="h-fit w-full">
        <View className="mt-4 h-fit w-full rounded-2xl">
          <View className="text-bg-pink-200 mb-3 h-fit w-fit items-center justify-center rounded-md rounded-t-2xl bg-[#7636a6]/80 p-2">
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
          className="absolute inset-0 z-20 overflow-hidden rounded-xl"
        >
          <BlurView
            intensity={30}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            className="absolute inset-0"
            style={{ borderRadius: 12 }}
          />
          <View className="relative flex w-full items-center  bg-[#380063a1] p-4 shadow-lg">
            <TouchableOpacity
              className="absolute right-1 top-1 z-10 p-1"
              onPress={() => setActive(false)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: 50 }}
            >
              <HugeiconsIcon
                icon={ArrowTurnBackwardIcon}
                size={22}
                color="pink"
              />
            </TouchableOpacity>

            <View>
              <Text className="font-Inter-SemiBold text-xl text-pink-100">
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

            <GestureHandlerRootView style={{ width: "100%", height: "auto" }}>
              <ScrollView
                className="h-fit w-full flex-row gap-3"
                horizontal
              >
                {data.days.map((day, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedDay(day.datetime)
                      setActive(true)
                    }}
                    className="mx-2 flex-row items-center justify-around border-t border-[#6412a3] py-3"
                  >
                    <View className="flex-col items-center justify-center gap-2">
                      <Text className="text font-Inter-SemiBold text-white">
                        {new Date(day.datetime).toLocaleDateString("es-Es", { weekday: "narrow" })}
                      </Text>
                      <Text
                        className={`rounded-full p-2 font-Inter-SemiBold text-sm text-pink-200 ${day.datetime === selectedDay && "bg-pink-100/20"} ${new Date(day.datetime).toDateString() === new Date().toDateString() ? "text-sky-300" : ""}`}
                      >
                        {new Date(day.datetime).toLocaleDateString("es-Es", { day: "numeric" })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </GestureHandlerRootView>

            <Animated.View
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
              className="flex-row items-center justify-center gap-2"
            >
              <HugeiconsIcon
                icon={selectedDropDown[1]}
                size={26}
                color="#fce7f3"
              />
              <Text className="mb-1 font-Inter-SemiBold text-xl text-pink-100">{selectedDropDown[0]}</Text>
            </Animated.View>

            <View className="mx-4 mt-1 w-full flex-row items-center justify-between">
              <View className="flex-col justify-center">
                <View className="h-fit w-full flex-row items-center gap-1">
                  <Text className="font-Inter-SemiBold text-4xl text-pink-200">{targetDate?.tempmax.toFixed(0)}º</Text>
                  <Text className="font-Inter-SemiBold text-4xl  text-pink-200/70">
                    {targetDate?.tempmin.toFixed(0)}º
                  </Text>
                  <Image
                    source={{
                      uri: Image.resolveAssetSource(getWeatherIcon(targetDate?.icon || "default")).uri,
                      cache: "force-cache",
                    }}
                    style={{ width: 40, height: 40 }}
                  />
                </View>
                <Text className="w-full font-Inter-Medium text-base text-pink-100">Celsius (ºC)</Text>
              </View>
              <DropDown
                onSelect={(option) => {
                  setSelectedDropDown(option)
                }}
                initialValue={selectedDropDown}
              />
            </View>

            <View className="h-fit w-full">
              <LineChart
                data={
                  targetDate?.hours?.map((h) => ({
                    value: selectedIndex === 0 ? h.temp : h.feelslike,
                    icon: h.icon,
                    date: h.datetime,
                    labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                  })) || []
                }
                animateOnDataChange
                rulesType="segmented"
                rulesColor="rgba(201, 159, 183, 0.2)"
                showVerticalLines
                showYAxisIndices={true}
                yAxisIndicesHeight={2}
                lineGradientDirection="vertical"
                lineGradientStartColor="#f556b0"
                lineGradientEndColor="#c99fb7"
                thickness={5}
                disableScroll
                color="#f455af"
                yAxisIndicesWidth={0}
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
                        stopOpacity={0}
                      />

                      <Stop
                        offset="1"
                        stopColor={"#7f2c5b"}
                        stopOpacity={0.5}
                      />
                    </LinearGradient>
                  )
                }}
                hideDataPoints
                initialSpacing={2}
                adjustToWidth
                endSpacing={1}
                width={chartWidth}
                height={180}
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
                  pointerStripHeight: 100,
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
              <SegmentedControl
                values={["Real", "Sensación"]}
                style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
                backgroundColor="#32244190"
                tintColor="#f556b0"
                fontStyle={{ fontFamily: "Inter", color: "#fce7f3" }}
                activeFontStyle={{ fontFamily: "Inter", color: "#fce7f3" }}
                enabled={true}
                selectedIndex={selectedIndex}
                onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </>
  )
}
