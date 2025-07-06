import { View, Text } from "react-native"
import React from "react"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { DropletIcon } from "@hugeicons/core-free-icons"
import { EmbalseDataHistorical } from "types/index"

export default function EmbStatusReport({
  emb_data,
  embalse,
  fecha,
}: {
  emb_data: EmbalseDataHistorical
  embalse: string
  fecha?: Date | undefined
}) {
  return (
    <View className="mt-8">
      <View className="mb-3 self-start rounded-2xl bg-indigo-900 px-2 py-1">
        <Text className="font-Inter-SemiBold text-lg text-indigo-200">Estado del embalse</Text>
      </View>
      <View className="rounded-2xl bg-indigo-200 ">
        <Text className="px-3 pt-3 font-Inter-Medium text-lg leading-relaxed text-indigo-800">
          El embalse de <Text className="font-bold">{embalse}</Text> se encontraba al
          <Text className="font-bold"> {emb_data?.porcentaje}%</Text> el{" "}
          <Text className="font-bold">
            {fecha
              ? new Date(fecha).toLocaleDateString("es-Es", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </Text>
        </Text>

        {/* Fecha del dato */}
        <View className="mt-3 flex w-full flex-row items-center gap-6 border-t border-indigo-800">
          <View className="flex-1 flex-col justify-center gap-1 px-3 py-2">
            <Text className="font-Inter-SemiBold text-xl text-indigo-600">Fecha del Boletin</Text>
            <Text className="font-Inter-Black text-xl text-indigo-950">
              {fecha
                ? new Date(fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "No disponible"}
            </Text>
          </View>
        </View>

        <View className="mb-3 flex-col gap-4 px-3">
          {/* Agua Embalsada */}
          <View className="flex w-full flex-row items-center gap-6">
            <View className="h-20 w-20 flex-none items-center justify-center rounded-2xl bg-indigo-300 p-2">
              <HugeiconsIcon
                icon={DropletIcon}
                size={50}
                color="#eef2ff"
              />
            </View>
            <View className="flex-1 flex-col justify-center gap-1">
              <Text className="font-Inter-SemiBold text-xl  text-indigo-800">Agua Embalsada</Text>
              <Text className="font-Inter-Black text-4xl text-indigo-950">
                {emb_data && emb_data.volumen_actual}
                <Text className="font-Inter-SemiBold text-base"> hm³</Text>
              </Text>
              <Text className="font-Inter-SemiBold text-indigo-800">
                {emb_data && emb_data.porcentaje != null ? emb_data.porcentaje.toFixed(1) : "N/A"}% capacidad total
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
