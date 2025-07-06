import { View, Text } from "react-native"
import { Moon } from "lunarphase-js"
import { getFishActivityEmoji, getFishActivityLevel, translateLunarPhase } from "lib/fishingActivity"

export default function LunarReport({ date }: { date: Date }) {
  const phase = Moon.lunarPhase(date)
  const emogi = Moon.lunarPhaseEmoji(date)
  const age = Moon.lunarAge(date)
  const activityLevel = getFishActivityLevel(age)

  return (
    <View className="mt-8">
      <View className="mb-3 self-start rounded-2xl bg-yellow-900 px-2 py-1">
        <Text className="font-Inter-SemiBold text-lg text-yellow-200">Fase lunar y actividad de pesca</Text>
      </View>
      <View className="flex-col items-center justify-center rounded-2xl bg-yellow-50">
        <View className="border-b border-yellow-800">
          <Text className="p-2 font-Inter-Medium text-lg text-yellow-800">
            El día{" "}
            <Text className="font-bold">
              {date
                ? new Date(date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : ""}
            </Text>{" "}
            hubo una fase lunar de <Text className="font-bold">{translateLunarPhase(phase)}</Text>, y el nivel de
            actividad de los peces fue{" "}
            <Text className="font-bold">
              {activityLevel === 0
                ? "desconocido"
                : activityLevel === 1
                  ? "bajo"
                  : activityLevel === 2
                    ? "medio"
                    : "alto"}
            </Text>
            .
          </Text>
        </View>
        <View className="flex-row items-center justify-center gap-4 p-3">
          <Text className="text-5xl">{emogi}</Text>
          <Text className="text-4xl">{getFishActivityEmoji(activityLevel)}</Text>
        </View>
      </View>
    </View>
  )
}
