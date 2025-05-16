/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react"
import type { EmbalseDataHistorical } from "../../types"
import { View, Text } from "react-native"
import { LineChart } from "react-native-gifted-charts"

interface ChartProps {
  data: EmbalseDataHistorical[]
}

interface ProcessedData {
  mes: string
  mes_num: number
  porcentaje2025?: number
  porcentaje2024?: number
  media10anios?: number
  high?: number
  med?: number
  low?: number
}

export default function Chart({ data }: ChartProps) {
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  const processedData = useMemo(() => {
    const currentYear = 2025
    const lastYear = 2024
    const startAverageYear = 2015

    const monthsData: ProcessedData[] = Array.from({ length: 12 }, (_, i) => ({
      mes: monthNames[i],
      mes_num: i + 1,
    }))

    const data2025 = data.filter((item) => new Date(item.fecha).getFullYear() === currentYear)
    const data2024 = data.filter((item) => new Date(item.fecha).getFullYear() === lastYear)
    const dataFor10Years = data.filter((item) => {
      const year = new Date(item.fecha).getFullYear()
      return year >= startAverageYear && year <= lastYear
    })

    data2025.forEach((item) => {
      const month = new Date(item.fecha).getMonth()
      if (!monthsData[month].porcentaje2025) {
        const val = parseFloat(item.porcentaje.toFixed(2))
        monthsData[month].porcentaje2025 = val
        monthsData[month].high = val
      }
    })

    data2024.forEach((item) => {
      const month = new Date(item.fecha).getMonth()
      if (!monthsData[month].porcentaje2024) {
        const val = parseFloat(item.porcentaje.toFixed(2))
        monthsData[month].porcentaje2024 = val
        monthsData[month].med = val
      }
    })

    const monthlyAverages: { [key: number]: { sum: number; count: number } } = {}
    dataFor10Years.forEach((item) => {
      const month = new Date(item.fecha).getMonth()
      if (!monthlyAverages[month]) monthlyAverages[month] = { sum: 0, count: 0 }
      monthlyAverages[month].sum += item.porcentaje
      monthlyAverages[month].count += 1
    })

    Object.entries(monthlyAverages).forEach(([monthStr, { sum, count }]) => {
      const month = parseInt(monthStr)
      if (count > 0) {
        const avg = parseFloat((sum / count).toFixed(2))
        monthsData[month].media10anios = avg
        monthsData[month].low = avg
      }
    })

    // No inicializamos valores futuros a 0
    return monthsData
  }, [data])

  if (!data || data.length === 0) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Text>No hay datos disponibles</Text>
      </View>
    )
  }

  const currentMonth = new Date().getMonth()

  // Calcular el rango para el eje Y basado en los valores reales
  const allValues = processedData
    .flatMap((item) => [item.media10anios, item.porcentaje2024, item.porcentaje2025])
    .filter((value) => value !== undefined) as number[]

  // Obtener valores máximo con un margen, pero nunca superior a 100%
  const calculatedMax = Math.ceil(Math.max(...allValues) * 1.15)
  const maxValue = Math.min(100, calculatedMax)

  // Calcular cuántas líneas mostrar en el eje Y (entre 3-5 líneas)
  const stepSize = Math.max(5, Math.ceil(maxValue / 4))

  return (
    <View className="mt-10">
      <View className="w-full">
        <LineChart
          curved
          data={processedData.map((item) => ({
            value: item.media10anios !== undefined ? item.media10anios : undefined,
            label: item.mes,
          }))}
          data2={processedData.map((item) => ({
            value: item.porcentaje2024 !== undefined ? item.porcentaje2024 : undefined,
          }))}
          data3={processedData
            .filter((item, index) => index <= currentMonth)
            .map((item) => ({
              value: item.porcentaje2025 !== undefined ? item.porcentaje2025 : undefined,
            }))}
          maxValue={maxValue}
          stepValue={stepSize}
          noOfSections={Math.ceil(maxValue / stepSize)}
          stepHeight={30}
          yAxisLabelTexts={Array.from({ length: Math.ceil(maxValue / stepSize) + 1 }, (_, i) => `${i * stepSize}%`)}
          width={330}
          color1="#229b10"
          color2="#008be7"
          color3="#ffa500"
          dataPointsColor1="#229b10"
          dataPointsColor2="#008be7"
          dataPointsColor3="#ffa500"
          xAxisColor={"#fff"}
          yAxisColor={"#fff"}
          pointerConfig={{
            radius: 5,
            pointerColor: "#fff",
            pointerLabelWidth: 120,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: { label?: string; value?: number }[]) => {
              return (
                <View style={{ backgroundColor: "rgba(0,0,0,0.8)", padding: 8, borderRadius: 4 }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>
                    {items[0]?.label}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 8, height: 8, backgroundColor: "#229b10", marginRight: 5 }} />
                    <Text style={{ color: "#fff", fontSize: 10 }}>2025: {items[2]?.value?.toFixed(2)}%</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 8, height: 8, backgroundColor: "#008be7", marginRight: 5 }} />
                    <Text style={{ color: "#fff", fontSize: 10 }}>2024: {items[1]?.value?.toFixed(2)}%</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 8, height: 8, backgroundColor: "#ffa500", marginRight: 5 }} />
                    <Text style={{ color: "#fff", fontSize: 10 }}>Media 10 años: {items[0]?.value?.toFixed(2)}%</Text>
                  </View>
                </View>
              )
            },
          }}
          hideRules
          spacing={29}
          adjustToWidth={true}
          showFractionalValues={true}
          xAxisLabelTextStyle={{ fontSize: 8, color: "#fff" }}
          horizontalRulesStyle={{ strokeWidth: 0.5 }}
          initialSpacing={10}
          endSpacing={10}
          yAxisTextStyle={{ fontSize: 10, color: "#fff" }}
          yAxisLabelSuffix="%"
        />
      </View>

      <View className="mt-4 flex-row justify-center gap-4 space-x-6">
        <View className="flex-row items-center">
          <View className="mr-2 h-3 w-8 bg-[#229b10]" />
          <Text className="text-xs text-white">2025</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-3 w-8 bg-[#008be7]" />
          <Text className="text-xs text-white">2024</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-3 w-8 bg-[#ffa500]" />
          <Text className="text-xs text-white">Media 10 años</Text>
        </View>
      </View>
    </View>
  )
}
