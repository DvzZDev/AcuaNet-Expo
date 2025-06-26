import { Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"

const Situacion = [
  "Banco de alburnos",
  "Cortados",
  "Alguero",
  "Arboles sumergidos",
  "Playones",
  "Estructura de granito",
  "Estructura de pizarra",
]

export default function DropDownSituacion({
  setSituacion,
  situacionSelector,
  setSituacionSelector,
}: {
  setSituacion?: (situacion: string) => void
  situacionSelector?: boolean
  setSituacionSelector?: (value: boolean) => void
}) {
  if (!situacionSelector) return null

  const handleSituacionSelect = (situacion: string) => {
    setSituacion?.(situacion)
    setSituacionSelector?.(false)
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className="absolute left-0 right-0 top-24 z-50"
    >
      <ScrollView className="h-[12rem] self-start overflow-hidden rounded-xl border border-lime-500 bg-lime-300">
        {Situacion.map((tecnica, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSituacionSelect(tecnica)}
            className="flex-row items-center justify-between border-lime-500 border-b gap-4 px-3 py-2"
          >
            <Text className="font-Inter-Medium text-lg text-lime-800">{tecnica}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )
}
