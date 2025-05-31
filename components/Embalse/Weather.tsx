import React, { useState } from "react"
import { LineChart, yAxisSides } from "react-native-gifted-charts"
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutRight } from "react-native-reanimated"
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { degreesToWindDirection } from "lib/WDirection"

import type { WeatherData } from "types"
import { getWeatherIcon } from "../../lib/weatherIcon"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { ArrowTurnBackwardIcon, SunCloud02Icon } from "@hugeicons/core-free-icons"
import { LinearGradient, Stop } from "react-native-svg"
import DropDown from "../Embalse/ContentModal/Dropdown"

export default function Weather({ data }: { data: WeatherData | null | undefined }) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [active, setActive] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedDropDown, setSelectedDropDown] = useState<[string, any]>(["Condiciones", SunCloud02Icon])
  const chartWidth = Dimensions.get("window").width - 55
  const targetDate = data?.days.find((day) => day.datetime === selectedDay)
  const dateNow = new Date().getHours()
  if (!data || !data.days || data.days.length === 0) {
    return (
      <View className="h-fit w-full">
        <View className="mt-4 h-fit w-full rounded-2xl bg-[#380063] p-4">
          <Text className="text-center font-Inter-Medium text-pink-200">No hay datos meteorológicos disponibles</Text>
        </View>
      </View>
    )
  }
  const currentDay = data.days[0]
  const sunrise = currentDay.sunrise
  const sunset = currentDay.sunset
  const sunriseHour = parseInt(sunrise.slice(0, 2))
  const sunsetHour = parseInt(sunset.slice(0, 2))

  return (
    <>
      <View className="h-fit w-full">
        <View className="mt-4 h-fit w-full rounded-2xl">
          <View className="text-bg-pink-200 mb-3 h-fit w-fit items-center justify-center rounded-md rounded-t-2xl bg-[#7636a6]/80 p-2">
            <Text className="font-Inter-Medium text-pink-200">{data.days[0].description}</Text>
          </View>
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-[24rem] w-full"
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
                      className="flex-row items-center justify-around py-3"
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
        </View>
      </View>

      {active && (
        <Animated.View
          entering={SlideInLeft.duration(150)}
          exiting={SlideOutRight.duration(150)}
          className="absolute inset-0 z-20 overflow-hidden rounded-xl"
        >
          <View className="relative flex w-full items-center  bg-[#270042] px-4 shadow-lg">
            <TouchableOpacity
              className="absolute right-1 top-0 z-10 p-1"
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
                    className="mx-2 flex-row items-center justify-around py-3"
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
              className="my-1 flex-row items-center justify-center gap-2"
            >
              <HugeiconsIcon
                icon={selectedDropDown[1]}
                size={26}
                color="#fce7f3"
              />
              <Text className="mb-1 font-Inter-SemiBold text-xl text-pink-100">{selectedDropDown[0]}</Text>
            </Animated.View>

            <View className="mx-4 my-3 w-full flex-row items-center justify-between">
              {selectedDropDown[0] === "Condiciones" ? (
                <View className="flex-col justify-center">
                  <View className="h-fit w-full flex-row items-center gap-1">
                    <Text className="font-Inter-SemiBold text-4xl text-pink-200">
                      {targetDate?.tempmax.toFixed(0)}º
                    </Text>
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
              ) : selectedDropDown[0] === "Viento" ? (
                <View className="flex-col justify-center">
                  <View className="h-fit w-fit flex-row gap-1">
                    <Text className="font-Inter-SemiBold text-4xl text-pink-200">
                      {targetDate?.windspeedmax} <Text className="text-2xl">km/h</Text>
                    </Text>
                    <Text className="font-Inter-SemiBold text-4xl text-pink-200/70">
                      {degreesToWindDirection(targetDate?.winddir || 0, "short")}
                    </Text>
                  </View>
                  <View className="w-fit flex-row items-center gap-1">
                    <Text className="font-Inter-Medium text-base text-pink-100">Rachas</Text>
                    <Text className="font-Inter-Medium text-base text-pink-100">
                      {" "}
                      {targetDate?.windgust} <Text className="font-Inter-Medium text-base text-pink-100">km/h</Text>
                    </Text>
                  </View>
                </View>
              ) : selectedDropDown[0] === "Presion" ? (
                <View className="flex-col justify-center">
                  <View className="h-fit w-fit flex-row gap-1">
                    <Text className="font-Inter-SemiBold text-4xl text-pink-200">
                      {targetDate?.pressure} <Text className="text-2xl">hPa</Text>
                    </Text>
                  </View>
                  <View className="w-fit flex-row items-center gap-1">
                    <Text className="font-Inter-Medium text-base text-pink-100">Presión</Text>
                  </View>
                </View>
              ) : (
                <View className="flex-col justify-center">
                  <View className="h-fit w-fit flex-row gap-1">
                    <Text className="font-Inter-SemiBold text-4xl text-pink-200">
                      {targetDate?.humidity} <Text className="text-2xl">%</Text>
                    </Text>
                  </View>
                  <View className="w-fit flex-row items-center gap-1">
                    <Text className="font-Inter-Medium text-base text-pink-100">Humedad</Text>
                  </View>
                </View>
              )}

              <DropDown
                onSelect={(option) => {
                  setSelectedDropDown(option)
                }}
                initialValue={selectedDropDown}
              />
            </View>
            {selectedDropDown[0] === "Condiciones" ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="h-full w-full"
              >
                <LineChart
                  data={
                    targetDate?.hours?.map((h, index) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      const today = new Date().toDateString()
                      const selectedDateString = new Date(selectedDay).toDateString()
                      const isToday = today === selectedDateString
                      const isCurrentHour = hour === dateNow && isToday
                      return {
                        value: selectedIndex === 0 ? h.temp : h.feelslike,
                        icon: h.icon,
                        date: h.datetime,
                        labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                        showDataPoint: isCurrentHour,
                        dataPointColor: isCurrentHour ? "#00ff88" : "transparent",
                        dataPointRadius: isCurrentHour ? 5 : 0,
                        dataPointShape: isCurrentHour ? "circular" : undefined,
                      }
                    }) || []
                  }
                  xAxisLabelTexts={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      return [0, 6, 12, 18].includes(hour) ? h.datetime.slice(0, 5) : ""
                    }) || []
                  }
                  yAxisLabelSuffix="º"
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisTextStyle={{ color: "#c99fb7", fontFamily: "Inter" }}
                  xAxisColor={"#fff"}
                  yAxisColor={"#fff"}
                  width={chartWidth}
                  height={225}
                  initialSpacing={2}
                  endSpacing={1}
                  adjustToWidth
                  color="#f455af"
                  thickness={4}
                  areaChart
                  areaGradientId="ggrd"
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
                  lineGradientDirection="vertical"
                  lineGradientStartColor="#f556b0"
                  lineGradientEndColor="#c99fb7"
                  animateOnDataChange
                  isAnimated
                  verticalLinesStrokeDashArray={[5, 5]}
                  rulesColor="rgba(201, 159, 183, 0.1)"
                  showVerticalLines
                  verticalLinesColor={"rgba(201, 159, 183, 0.1)"}
                  verticalLinesThickness={1}
                  showYAxisIndices={true}
                  yAxisIndicesHeight={2}
                  yAxisIndicesWidth={0}
                  hideDataPoints={false}
                  maxValue={45}
                  stepValue={5}
                  disableScroll
                  pointerConfig={{
                    pointerStripHeight: 100,
                    pointerStripColor: "#c99fb7",
                    pointerStripWidth: 2,
                    hidePointers: false,
                    stripOverPointer: true,
                    pointerColor: "#f556b0",
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 120,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      const totalHours = targetDate?.hours?.length || 24
                      const hourIndex = targetDate?.hours?.findIndex((h) => h.datetime === items[0].date) || 0
                      const isNearEnd = hourIndex > totalHours * 0.75

                      return (
                        <View className={`mb-[8rem] h-fit w-[8.6rem] ${isNearEnd ? "ml-[-8rem]" : "justify-center"}`}>
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
                              <Text className="font-Inter-Bold text-4xl text-pink-200">
                                {items[0].value.toFixed(0)}º
                              </Text>
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
              </Animated.View>
            ) : selectedDropDown[0] === "Viento" ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="h-full w-full"
              >
                <LineChart
                  data={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      const today = new Date().toDateString()
                      const selectedDateString = new Date(selectedDay).toDateString()
                      const isToday = today === selectedDateString
                      const isCurrentHour = hour === dateNow && isToday
                      return {
                        value: h.windspeed,
                        icon: h.icon,
                        date: h.datetime,
                        labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                        showDataPoint: isCurrentHour,
                        dataPointColor: isCurrentHour ? "#00ff88" : "transparent",
                        dataPointRadius: isCurrentHour ? 5 : 0,
                        dataPointShape: isCurrentHour ? "circular" : undefined,
                      }
                    }) || []
                  }
                  data2={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      const today = new Date().toDateString()
                      const selectedDateString = new Date(selectedDay).toDateString()
                      const isToday = today === selectedDateString
                      const isCurrentHour = hour === dateNow && isToday
                      return {
                        value: h.windgust,
                        icon: h.icon,
                        date: h.datetime,
                        labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                        showDataPoint: isCurrentHour,
                        dataPointColor: isCurrentHour ? "#00ff88" : "transparent",
                        dataPointRadius: isCurrentHour ? 5 : 0,
                        dataPointShape: isCurrentHour ? "circular" : undefined,
                      }
                    }) || []
                  }
                  xAxisLabelTexts={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      return [0, 6, 12, 18, 23].includes(hour) ? h.datetime.slice(0, 2) : ""
                    }) || []
                  }
                  areaChart
                  yAxisLabelSuffix="º"
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisTextStyle={{ color: "#c99fb7", fontFamily: "Inter" }}
                  xAxisColor={"#fff"}
                  yAxisColor={"#fff"}
                  width={chartWidth}
                  height={260}
                  initialSpacing={2}
                  endSpacing={1}
                  adjustToWidth
                  color="#09f"
                  color2="#0099ff95"
                  thickness={4}
                  thickness2={2}
                  startFillColor1="#09f"
                  startFillColor2="#27004250"
                  endFillColor1="transparent"
                  startOpacity={0.8}
                  endOpacity={0}
                  lineGradientDirection="vertical"
                  animateOnDataChange
                  isAnimated
                  verticalLinesStrokeDashArray={[5, 5]}
                  rulesColor="rgba(201, 159, 183, 0.1)"
                  showVerticalLines
                  verticalLinesColor={"rgba(201, 159, 183, 0.1)"}
                  verticalLinesThickness={1}
                  showYAxisIndices={true}
                  yAxisIndicesHeight={2}
                  yAxisIndicesWidth={0}
                  hideDataPoints={false}
                  maxValue={50}
                  stepValue={10}
                  disableScroll
                  pointerConfig={{
                    pointerStripHeight: 100,
                    pointerStripColor: "#c99fb7",
                    pointerStripWidth: 2,
                    hidePointers: false,
                    stripOverPointer: true,
                    pointerColor: "#f556b0",
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 100,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      const totalHours = targetDate?.hours?.length || 24
                      const hourIndex = targetDate?.hours?.findIndex((h) => h.datetime === items[0].date) || 0
                      const isNearEnd = hourIndex > totalHours * 0.75

                      return (
                        <View className={`mb-[6rem] h-fit w-[8.6rem] ${isNearEnd ? "ml-[-8rem]" : "justify-center"}`}>
                          <View className="flex-col items-center justify-center gap-1 rounded-xl bg-[#23053a] p-3">
                            <Text className="text-center font-Inter-SemiBold text-lg text-pink-200/60">
                              {items[0].date.slice(0, 5)}
                            </Text>
                            <View className="flex-row items-center justify-center gap-1">
                              <Text className="font-Inter-Bold text-4xl text-pink-200">
                                {items[0].value.toFixed(0)}{" "}
                                <Text className="font-Inter-Medium text-lg text-pink-200">km/h</Text>
                              </Text>
                            </View>
                            <Text
                              className="mt-1 text-center font-Inter-SemiBold text-sm text-pink-200/60"
                              numberOfLines={1}
                            >
                              Rachas {items[1].value.toFixed(0)} km/h
                            </Text>
                          </View>
                        </View>
                      )
                    },
                  }}
                />
              </Animated.View>
            ) : selectedDropDown[0] === "Presion" ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="h-full w-full"
              >
                <LineChart
                  data={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      const today = new Date().toDateString()
                      const selectedDateString = new Date(selectedDay).toDateString()
                      const isToday = today === selectedDateString
                      const isCurrentHour = hour === dateNow && isToday
                      return {
                        value: h.pressure - 975,
                        icon: h.icon,
                        date: h.datetime,
                        originalPressure: h.pressure,
                        labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                        showDataPoint: isCurrentHour,
                        dataPointColor: isCurrentHour ? "#00ff88" : "transparent",
                        dataPointRadius: isCurrentHour ? 5 : 0,
                        dataPointShape: isCurrentHour ? "circular" : undefined,
                      }
                    }) || []
                  }
                  xAxisLabelTexts={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      return [0, 6, 12, 18].includes(hour) ? h.datetime.slice(0, 5) : ""
                    }) || []
                  }
                  yAxisLabelSuffix=" hPa"
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisTextStyle={{ color: "#c99fb7", fontFamily: "Inter", marginLeft: 15, width: 36 }}
                  xAxisColor={"#fff"}
                  yAxisColor={"#fff"}
                  width={chartWidth - 8}
                  height={225}
                  initialSpacing={2}
                  endSpacing={1}
                  adjustToWidth
                  color="#f455af"
                  thickness={4}
                  areaChart
                  areaGradientId="ggrd"
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
                  lineGradientDirection="vertical"
                  lineGradientStartColor="#f556b0"
                  lineGradientEndColor="#c99fb7"
                  animateOnDataChange
                  isAnimated
                  verticalLinesStrokeDashArray={[5, 5]}
                  rulesColor="rgba(201, 159, 183, 0.1)"
                  showVerticalLines
                  verticalLinesColor={"rgba(201, 159, 183, 0.1)"}
                  verticalLinesThickness={1}
                  showYAxisIndices={true}
                  yAxisIndicesHeight={2}
                  yAxisIndicesWidth={0}
                  hideDataPoints={false}
                  maxValue={90}
                  noOfSections={9}
                  yAxisLabelTexts={Array.from({ length: 10 }, (_, i) => `${975 + i * 10}`)}
                  disableScroll
                  pointerConfig={{
                    pointerStripHeight: 100,
                    pointerStripColor: "#c99fb7",
                    pointerStripWidth: 2,
                    hidePointers: false,
                    stripOverPointer: true,
                    pointerColor: "#f556b0",
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 120,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      const totalHours = targetDate?.hours?.length || 24
                      const hourIndex = targetDate?.hours?.findIndex((h) => h.datetime === items[0].date) || 0
                      const isNearEnd = hourIndex > totalHours * 0.75

                      return (
                        <View className={`mb-[8rem] h-fit w-[11rem] ${isNearEnd ? "ml-[-8rem]" : "justify-center"}`}>
                          <View className="flex-col items-center justify-center gap-1 rounded-xl bg-[#23053a] p-3">
                            <Text className="mb-1.5 text-center font-Inter-SemiBold text-lg text-pink-200/60">
                              {items[0].date.slice(0, 5)}
                            </Text>
                            <View className="flex-row items-center justify-center gap-1">
                              <Text
                                numberOfLines={1}
                                className="w-fit font-Inter-Bold text-4xl text-pink-200"
                              >
                                {items[0].originalPressure.toFixed(0)} <Text className="text-2xl">hPa</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    },
                  }}
                />
              </Animated.View>
            ) : (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="h-full w-full"
              >
                <LineChart
                  data={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      const today = new Date().toDateString()
                      const selectedDateString = new Date(selectedDay).toDateString()
                      const isToday = today === selectedDateString
                      const isCurrentHour = hour === dateNow && isToday
                      return {
                        value: h.humidity,
                        icon: h.icon,
                        date: h.datetime,
                        labelTextStyle: { color: "#c99fb7", fontFamily: "Inter", width: 35, fontSize: 12 },
                        showDataPoint: isCurrentHour,
                        dataPointColor: isCurrentHour ? "#00ff88" : "transparent",
                        dataPointRadius: isCurrentHour ? 5 : 0,
                        dataPointShape: isCurrentHour ? "circular" : undefined,
                      }
                    }) || []
                  }
                  xAxisLabelTexts={
                    targetDate?.hours?.map((h) => {
                      const hour = parseInt(h.datetime.slice(0, 2))
                      return [0, 6, 12, 18].includes(hour) ? h.datetime.slice(0, 5) : ""
                    }) || []
                  }
                  yAxisLabelSuffix="%"
                  yAxisSide={yAxisSides.RIGHT}
                  yAxisTextStyle={{ color: "#c99fb7", fontFamily: "Inter", marginLeft: 15, width: 36 }}
                  xAxisColor={"#fff"}
                  yAxisColor={"#fff"}
                  width={chartWidth - 8}
                  height={225}
                  initialSpacing={2}
                  endSpacing={1}
                  adjustToWidth
                  color="#f455af"
                  thickness={4}
                  areaChart
                  areaGradientId="ggrd"
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
                  lineGradientDirection="vertical"
                  lineGradientStartColor="#f556b0"
                  lineGradientEndColor="#c99fb7"
                  animateOnDataChange
                  isAnimated
                  verticalLinesStrokeDashArray={[5, 5]}
                  rulesColor="rgba(201, 159, 183, 0.1)"
                  showVerticalLines
                  verticalLinesColor={"rgba(201, 159, 183, 0.1)"}
                  verticalLinesThickness={1}
                  showYAxisIndices={true}
                  yAxisIndicesHeight={2}
                  yAxisIndicesWidth={0}
                  hideDataPoints={false}
                  maxValue={100}
                  stepValue={20}
                  disableScroll
                  pointerConfig={{
                    pointerStripHeight: 100,
                    pointerStripColor: "#c99fb7",
                    pointerStripWidth: 2,
                    hidePointers: false,
                    stripOverPointer: true,
                    pointerColor: "#f556b0",
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 120,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      const totalHours = targetDate?.hours?.length || 24
                      const hourIndex = targetDate?.hours?.findIndex((h) => h.datetime === items[0].date) || 0
                      const isNearEnd = hourIndex > totalHours * 0.75

                      return (
                        <View className={`mb-[8rem] h-fit w-[11rem] ${isNearEnd ? "ml-[-8rem]" : "justify-center"}`}>
                          <View className="flex-col items-center justify-center gap-1 rounded-xl bg-[#23053a] p-3">
                            <Text className="mb-1.5 text-center font-Inter-SemiBold text-lg text-pink-200/60">
                              {items[0].date.slice(0, 5)}
                            </Text>
                            <View className="flex-row items-center justify-center gap-1">
                              <Text
                                numberOfLines={1}
                                className="w-fit font-Inter-Bold text-4xl text-pink-200"
                              >
                                {items[0].value.toFixed(0)} <Text className="text-2xl">%</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    },
                  }}
                />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      )}
    </>
  )
}
