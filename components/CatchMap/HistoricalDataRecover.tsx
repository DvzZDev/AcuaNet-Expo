import { DropletIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { getClosestByDate } from "lib/EmbHistorical"
import { useMemo } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

export default function HistoricalDataDisplay({
  data,
  imageDate,
  isLoading,
  embalse,
}: {
  data: any
  imageDate: string | null
  isLoading: boolean
  embalse: string | null
}) {
  const closesEmbData = useMemo(() => {
    return data && Array.isArray(data) && data.length > 0 && imageDate
      ? getClosestByDate(data, new Date(imageDate))
      : null
  }, [data, imageDate])

  if (isLoading) {
    return (
      <View className="mx-2 mb-4 items-center justify-center py-8">
        <ActivityIndicator
          size="large"
          color="#4f46e5"
        />
        <Text className="mt-2 font-Inter-Medium text-gray-600">Recuperando datos históricos...</Text>
      </View>
    )
  }

  if (!embalse) {
    return (
      <View className="mx-2 mb-4">
        <View className="rounded-lg bg-orange-100 p-4">
          <Text className="font-Inter-Medium text-orange-800">
            Para ver los datos históricos, primero debe completar el paso anterior y seleccionar un embalse.
          </Text>
        </View>
      </View>
    )
  }

  if (!closesEmbData) {
    return (
      <View className="mx-2 mb-4">
        <View className="rounded-lg bg-yellow-100 p-4">
          <Text className="font-Inter-Medium leading-relaxed text-yellow-800">
            No hay datos históricos disponibles para este embalse en la fecha seleccionada. Por favor, asegúrate en el
            paso anterior de que el nombre del embalse es correcto. En algunos casos, los datos pueden no estar
            disponibles por falta de datos.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <Animated.View
      entering={FadeIn}
      className="mx-2 mb-4"
    >
      <View className="rounded-2xl bg-[#f0f9ff] p-4">
        <Text className="mb-4 font-Inter-SemiBold text-lg text-[#032e15]">
          El embalse se encontraba aproximadamente al{" "}
          <Text className="font-Inter-Black text-emerald-500">{closesEmbData.porcentaje} %</Text> el{" "}
          <Text className="font-Inter-Black text-emerald-500">
            {new Date(imageDate || new Date()).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </Text>
        <View className="flex w-full flex-row items-center gap-6">
          <View className="flex-1 flex-col justify-center gap-1">
            <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Fecha del Boletín</Text>
            <Text className="font-Inter-Black text-xl text-[#032e15]">
              {closesEmbData.fecha
                ? new Date(closesEmbData.fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "No disponible"}
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-col gap-4">
          <View className="flex w-full flex-row items-center gap-6">
            <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
              <HugeiconsIcon
                icon={DropletIcon}
                size={40}
                color="black"
              />
            </View>
            <View className="flex-1 flex-col justify-center gap-1">
              <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Agua Embalsada</Text>
              <Text className="font-Inter-Black text-4xl text-[#032e15]">
                {closesEmbData.volumen_actual}
                <Text className="font-Inter-SemiBold text-base"> hm³</Text>
              </Text>
              <Text className="font-Inter-Bold text-lg text-[#3D7764]">
                {closesEmbData.porcentaje != null ? closesEmbData.porcentaje.toFixed(1) : "N/A"}
                <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}
