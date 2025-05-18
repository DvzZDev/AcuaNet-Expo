/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react"
import type { EmbalseDataHistorical } from "../../types"
import { getISOWeek } from "date-fns"
import { View, Text } from "react-native"
import { LineChart } from "react-native-gifted-charts"

interface ChartProps {
  data: EmbalseDataHistorical[]
  /** 'monthly' (default) or 'weekly' */
  filterMode?: "monthly" | "weekly"
}

interface ProcessedData {
  mes?: string
  mes_num?: number
  porcentaje2025?: number
  porcentaje2024?: number
  media10anios?: number
  high?: number
  med?: number
  low?: number
  semana?: string
  semana_num?: number
}

export default function Chart({ data, filterMode = "monthly" }: ChartProps) {
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  const processedData = useMemo(() => {
    const currentYear = 2025
    const lastYear = 2024
    const startAverageYear = 2015
    const monthsData: ProcessedData[] = Array.from({ length: 12 }, (_, i) => ({ mes: monthNames[i], mes_num: i + 1 }))

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

    return monthsData
  }, [data])

  // computed weekly series for separate chart
  const weeklyProcessedData = useMemo(() => {
    const currentYear = 2025
    const lastYear = 2024
    const startAverageYear = 2015

    // calculate max ISO week across full historical range
    const allWeeksItems = data.filter((item) => {
      const y = new Date(item.fecha).getFullYear()
      return y >= startAverageYear && y <= currentYear
    })
    const maxWeek = allWeeksItems.length
      ? allWeeksItems.reduce((max, item) => Math.max(max, getISOWeek(new Date(item.fecha))), 0)
      : 0
    if (maxWeek === 0) return [] as ProcessedData[]
    const weeks: ProcessedData[] = Array.from({ length: maxWeek }, (_, i) => ({
      semana: `W${i + 1}`,
      semana_num: i + 1,
    }))

    const data2024 = data.filter((item) => new Date(item.fecha).getFullYear() === lastYear)
    const dataFor10 = data.filter((item) => {
      const y = new Date(item.fecha).getFullYear()
      return y >= startAverageYear && y <= lastYear
    })
    // fill data for each week
    // add current year values
    data
      .filter((item) => new Date(item.fecha).getFullYear() === currentYear)
      .forEach((item) => {
        const w = getISOWeek(new Date(item.fecha))
        const v = parseFloat(item.porcentaje.toFixed(2))
        if (weeks[w - 1]) {
          if (!weeks[w - 1].porcentaje2025) {
            weeks[w - 1].porcentaje2025 = v
            weeks[w - 1].high = v
          }
        }
      })

    data2024.forEach((item) => {
      const w = getISOWeek(new Date(item.fecha))
      const v = parseFloat(item.porcentaje.toFixed(2))
      if (weeks[w - 1] && !weeks[w - 1].porcentaje2024) {
        weeks[w - 1].porcentaje2024 = v
        weeks[w - 1].med = v
      }
    })
    const avgs: { [wk: number]: { sum: number; count: number } } = {}
    dataFor10.forEach((item) => {
      const w = getISOWeek(new Date(item.fecha))
      if (!avgs[w]) avgs[w] = { sum: 0, count: 0 }
      avgs[w].sum += item.porcentaje
      avgs[w].count += 1
    })
    Object.entries(avgs).forEach(([wk, { sum, count }]) => {
      const w = +wk
      if (count > 0) {
        const a = parseFloat((sum / count).toFixed(2))
        weeks[w - 1].media10anios = a
        weeks[w - 1].low = a
      }
    })
    return weeks
  }, [data])

  // agrupar semanas de 2 en 2 para ajuste en el gráfico
  const groupedWeeklyData = useMemo(() => {
    const size = 2
    if (weeklyProcessedData.length === 0) return []
    const intervals = Math.ceil(weeklyProcessedData.length / size)
    return Array.from({ length: intervals }, (_, idx) => {
      const group = weeklyProcessedData.slice(idx * size, idx * size + size)
      const start = group[0]?.semana_num
      const end = group[group.length - 1]?.semana_num
      const label = start && end && start !== end ? `${start}-${end}` : `${start}`
      const avg = (key: keyof ProcessedData) => {
        const arr = group.map((item) => item[key]).filter((v) => v !== undefined) as number[]
        if (arr.length === 0) return undefined
        return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
      }
      return {
        label,
        media10anios: avg("media10anios"),
        porcentaje2024: avg("porcentaje2024"),
        porcentaje2025: avg("porcentaje2025"),
      }
    })
  }, [weeklyProcessedData])

  if (!data || data.length === 0) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Text>No hay datos disponibles</Text>
      </View>
    )
  }

  const currentIndex = filterMode === "weekly" ? getISOWeek(new Date()) - 1 : new Date().getMonth()

  // Calcular el rango para el eje Y basado en los valores reales
  const allValues = processedData
    .flatMap((item) => [item.media10anios, item.porcentaje2024, item.porcentaje2025])
    .filter((value) => value !== undefined) as number[]

  // Obtener valores máximo con un margen, pero nunca superior a 100%
  const calculatedMax = Math.ceil(Math.max(...allValues) * 1.15)
  const maxValue = Math.min(100, calculatedMax)

  // Calcular cuántas líneas mostrar en el eje Y (entre 3-5 líneas)
  const stepSize = Math.max(5, Math.ceil(maxValue / 4))

  // Limitar los datos de 2025 solo hasta el mes/semana actual
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentWeek = getISOWeek(now) - 1

  // Para el chart mensual: solo hasta el mes actual
  const processedDataLimited2025 = processedData.slice(0, currentMonth + 1).map((item) => ({
    ...item,
    porcentaje2025: item.porcentaje2025,
  }))
  const processedDataRest = processedData.map((item) => ({
    ...item,
    porcentaje2024: item.porcentaje2024,
    media10anios: item.media10anios,
  }))

  // Para el chart semanal agrupado: solo hasta la semana actual
  const groupedWeeklyDataLimited2025 = groupedWeeklyData.slice(0, Math.floor(currentWeek / 2) + 1).map((item) => ({
    ...item,
    porcentaje2025: item.porcentaje2025,
  }))
  const groupedWeeklyDataRest = groupedWeeklyData.map((item) => ({
    ...item,
    porcentaje2024: item.porcentaje2024,
    media10anios: item.media10anios,
  }))

  return (
    <View className="mt-10">
      {/* Monthly chart */}
      <View className="w-full">
        <Text className="mb-2 font-bold text-white">Mensual</Text>

        <LineChart
          curved
          isAnimated
          data={processedDataLimited2025.map((item) => ({
            value: item.porcentaje2025,
            label:
              filterMode === "weekly" ? (item.semana_num != null ? item.semana_num.toString() : item.semana) : item.mes,
          }))}
          data2={processedDataRest.map((item) => ({ value: item.porcentaje2024 }))}
          data3={processedDataRest.map((item) => ({ value: item.media10anios }))}
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
                <View className="w-[9rem] rounded bg-black/80 p-2">
                  <Text className="mb-1 text-[10px] font-bold text-white">{items[0]?.label}</Text>
                  {items[0]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#229b10]" />
                      <Text className="text-[10px] text-white">2025: {items[0].value.toFixed(2)}%</Text>
                    </View>
                  )}
                  {items[1]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#008be7]" />
                      <Text className="text-[10px] text-white">2024: {items[1].value.toFixed(2)}%</Text>
                    </View>
                  )}
                  {items[2]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#ffa500]" />
                      <Text className="text-[10px] text-white">Media 10 años: {items[2].value.toFixed(2)}%</Text>
                    </View>
                  )}
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

      {/* Monthly legend */}
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

      {/* Weekly chart */}
      <View className="mt-10">
        <Text className="mb-2 font-bold text-white">Semanal</Text>
        <LineChart
          curved
          isAnimated
          data={groupedWeeklyDataLimited2025.map((item) => ({ value: item.porcentaje2025, label: item.label }))}
          data2={groupedWeeklyDataRest.map((item) => ({ value: item.porcentaje2024 }))}
          data3={groupedWeeklyDataRest.map((item) => ({ value: item.media10anios }))}
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
          xAxisColor="#fff"
          yAxisColor="#fff"
          pointerConfig={{
            radius: 5,
            pointerColor: "#fff",
            pointerLabelWidth: 120,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: { label?: string; value?: number }[]) => {
              return (
                <View className="w-[9rem] rounded bg-black/80 p-2">
                  <Text className="mb-1 text-[10px] font-bold text-white">{items[0]?.label}</Text>
                  {items[0]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#229b10]" />
                      <Text className="text-[10px] text-white">2025: {items[0].value.toFixed(2)}%</Text>
                    </View>
                  )}
                  {items[1]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#008be7]" />
                      <Text className="text-[10px] text-white">2024: {items[1].value.toFixed(2)}%</Text>
                    </View>
                  )}
                  {items[2]?.value !== undefined && (
                    <View className="flex-row items-center">
                      <View className="mr-1.5 h-2 w-2 bg-[#ffa500]" />
                      <Text className="text-[10px] text-white">Media 10 años: {items[2].value.toFixed(2)}%</Text>
                    </View>
                  )}
                </View>
              )
            },
          }}
          hideRules
          spacing={12}
          adjustToWidth
          showFractionalValues
          xAxisLabelTextStyle={{
            fontSize: 8,
            color: "#fff",
            transform: [{ rotate: "-45deg" }],
            textAlign: "center",
            width: 20,
          }}
          horizontalRulesStyle={{ strokeWidth: 0.5 }}
          initialSpacing={10}
          endSpacing={10} // aumentar margen para pointer al final
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
