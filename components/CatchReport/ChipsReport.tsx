import { View, Text } from "react-native"
import React from "react"
import { Image } from "expo-image"
import { getFishImage } from "lib/getFishImage"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  AiIdeaFreeIcons,
  Angle01FreeIcons,
  Calendar01FreeIcons,
  MountainIcon,
  WeightScale01FreeIcons,
} from "@hugeicons/core-free-icons"
import WaterTemp from "@assets/icons/watertemp"

interface ChipsReportProps {
  especie?: string
  peso?: number
  situacion?: string
  temperatura?: number
  tecnica?: string
  profundidad?: string
  fecha?: Date | undefined
}

export default function ChipsReport({
  especie,
  peso,
  situacion,
  temperatura,
  tecnica,
  profundidad,
  fecha,
}: ChipsReportProps) {

  console.log("prof", profundidad)
  return (
    <View className="w-full flex-row flex-wrap gap-3">
      {/* Especie */}
      {especie && getFishImage(especie) && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#f1f1f1] px-2 py-1">
          <Image
            style={{ width: 50, height: "100%" }}
            contentFit="contain"
            source={getFishImage(especie)}
            tintColor={"#6a6c6e"}
          />
          <Text className="font-Inter-Bold text-base text-[#6a6c6e]">{String(especie)}</Text>
        </View>
      )}

      {/* Peso */}
      {peso && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#efeaff] px-2 py-1">
          <HugeiconsIcon
            icon={WeightScale01FreeIcons}
            size={24}
            color="#6837ed"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Bold text-base text-[#6837ed]">{String(peso)} kg</Text>
        </View>
      )}

      {/* Situación */}
      {situacion && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#c6f7ac] px-2 py-1">
          <HugeiconsIcon
            icon={MountainIcon}
            size={24}
            color="#287200"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Bold text-base text-[#287200]">{String(situacion)}</Text>
        </View>
      )}

      {/* Temperatura */}
      {temperatura && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#e5f3fe] px-2 py-1">
          <WaterTemp />
          <Text className="font-Inter-Bold text-base text-[#2669d3]">{String(temperatura)}°</Text>
        </View>
      )}

      {/* Técnica */}
      {tecnica && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#fcf4db] px-2 py-1">
          <HugeiconsIcon
            icon={AiIdeaFreeIcons}
            size={24}
            color="#a25a27"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Bold text-base text-[#a25a27]">{String(tecnica)}</Text>
        </View>
      )}

      {/* Profundidad */}
      {profundidad && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#f8e7fd] px-2 py-1">
          <HugeiconsIcon
            icon={Angle01FreeIcons}
            size={24}
            color="#c505ff"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Bold text-base text-[#c505ff]">{profundidad} m</Text>
        </View>
      )}

      {/* Fecha */}
      {fecha && (
        <View className="h-12 flex-row items-center justify-center gap-2 self-start rounded-2xl bg-[#fff4ee] px-2 py-1">
          <HugeiconsIcon
            icon={Calendar01FreeIcons}
            size={24}
            color="#bd5c06"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Bold text-base text-[#bd5c06]">
            {(() => {
              try {
                const date = new Date(fecha)
                if (isNaN(date.getTime())) {
                  return "Fecha inválida"
                }
                return date.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })
              } catch {
                return "Fecha inválida"
              }
            })()}
          </Text>
        </View>
      )}
    </View>
  )
}
