import { Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"

const Profundidad = ["1-5", "6-10", "11-15", "16-20", "21-25"]

export default function DropDownProfundidad({
  setProfundidad,
  profundidadSelector,
  setProfundidadSelector,
}: {
  setProfundidad?: (profundidad: string) => void
  profundidadSelector?: boolean
  setProfundidadSelector?: (value: boolean) => void
}) {
  if (!profundidadSelector) return null

  const handleProfundidadSelect = (profundidad: string) => {
    setProfundidad?.(profundidad)
    setProfundidadSelector?.(false)
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className="absolute left-0 right-0 top-24 z-50"
    >
      <ScrollView className="h-full self-start overflow-hidden rounded-xl border border-lime-500 bg-lime-300">
        {Profundidad.map((tecnica, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProfundidadSelect(tecnica)}
            className="flex-row items-center border-b border-lime-500 justify-between px-4 py-1"
          >
            <Text className="font-Inter-Medium text-lg text-lime-800">{tecnica}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )
}
