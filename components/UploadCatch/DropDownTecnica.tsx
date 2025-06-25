import { Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"

const TECNICAS_PESCA = [
  "Montaje Carolina",
  "Montaje Damiki",
  "Drop Shot",
  "Ned Rig",
  "Neko Rig",
  "Texas Rig",
  "Montaje Wacky",
  "Jigs Finesse",
  "Jigs flipping",
  "Jigs football",
  "Chatterbaits",
  "Spinnerbaits",
  "Umbrella Rig",
  "Swimbaits de vinilo grandes",
  "Swimbaits de vinilo pequeños/medianos",
  "Jerkbaits blandos",
  "Swimbait duro",
  "Jerkbait duro",
  "Crankbaits",
  "Crankbaits Squarbill",
  "Lipless",
  "Cucharillas",
  "Ranas",
  "Pikis",
  "Ikas",
  "Superficie paseante",
  "Superficie popper",
  "Boyas o flotadores",
]

export default function DropDownTecnica({
  setTecnica,
  tecnicaSelector,
  setTecnicaSelector,
}: {
  setTecnica?: (tecnica: string) => void
  tecnicaSelector?: boolean
  setTecnicaSelector?: (value: boolean) => void
}) {
  if (!tecnicaSelector) return null

  const handleTecnicaSelect = (tecnica: string) => {
    setTecnica?.(tecnica)
    setTecnicaSelector?.(false)
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className="absolute left-0 right-0 top-24 z-50"
    >
      <ScrollView className="h-[13rem] self-start overflow-hidden rounded-xl border border-lime-500 bg-lime-300">
        {TECNICAS_PESCA.map((tecnica, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTecnicaSelect(tecnica)}
            className="flex-row items-center justify-between px-3 py-2 border-b border-lime-500"
          >
            <Text className="font-Inter-Medium text-lime-800 text-lg">{tecnica}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )
}
