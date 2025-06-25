import { Image } from "expo-image"
import { Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"

const ESPECIES_PESCA = [
  { name: "Black Bass", image: require("assets/bass.png") },
  { name: "Lucio", image: require("assets/lucio.png") },
  { name: "Lucio Perca", image: require("assets/lucioperca.png") },
  { name: "Perca", image: require("assets/perca.png") },
  { name: "Carpa", image: require("assets/carpa.png") },
  { name: "Barbo", image: require("assets/barbo.png") },
  { name: "Siluro", image: require("assets/siluro.png") },
]

export default function DropDownEspecie({
  setSpecies,
  especieSelector,
  setEspecieSelector,
}: {
  setSpecies?: (species: string) => void
  especieSelector?: boolean
  setEspecieSelector?: (value: boolean) => void
}) {
  if (!especieSelector) return null

  const handleSpeciesSelect = (species: string) => {
    setSpecies?.(species)
    setEspecieSelector?.(false)
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className="absolute left-0 right-0 top-24 z-50"
    >
      <ScrollView className="h-full self-start overflow-hidden rounded-xl border border-lime-500 bg-lime-300">
        {ESPECIES_PESCA.map((especie, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSpeciesSelect(especie.name)}
            className={`flex-row items-center justify-between px-3 py-2 gap-5 ${index > 0 ? "border-t border-lime-500" : ""}`}
          >
            <Text className="font-Inter-Medium text-lime-800 text-lg">{especie.name}</Text>
            <Image
              source={especie.image}
              style={{ width: 50, height: 20 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )
}
