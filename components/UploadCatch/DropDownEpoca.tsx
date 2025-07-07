import { Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Leaf01Icon, Sun01Icon, TreeIcon, SnowIcon } from "@hugeicons/core-free-icons"

// Define épocas with their corresponding HugeIcons and colors
const epocas = [
  {
    name: "Primavera",
    icon: TreeIcon,
    bgColor: "bg-green-200",
    borderColor: "border-green-400",
    textColor: "text-green-800",
    iconColor: "#166534",
  },
  {
    name: "Verano",
    icon: Sun01Icon,
    bgColor: "bg-yellow-200",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-800",
    iconColor: "#92400e",
  },
  {
    name: "Otoño",
    icon: Leaf01Icon,
    bgColor: "bg-orange-200",
    borderColor: "border-orange-400",
    textColor: "text-orange-800",
    iconColor: "#9a3412",
  },
  {
    name: "Invierno",
    icon: SnowIcon,
    bgColor: "bg-blue-200",
    borderColor: "border-blue-400",
    textColor: "text-blue-800",
    iconColor: "#1e3a8a",
  },
]

export default function DropDownEpoca({
  setEpoca,
  epocaSelector,
  setEpocaSelector,
}: {
  setEpoca?: (epoca: string) => void
  epocaSelector?: boolean
  setEpocaSelector?: (value: boolean) => void
}) {
  if (!epocaSelector) return null

  const handleEpocaSelect = (epoca: string) => {
    setEpoca?.(epoca)
    setEpocaSelector?.(false)
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className="absolute left-0 right-0 top-24 z-50"
    >
      <ScrollView className="max-h-60 self-start overflow-hidden rounded-xl border border-lime-500 bg-lime-300">
        {epocas.map((epoca, index) => (
          <TouchableOpacity
            key={epoca.name}
            onPress={() => handleEpocaSelect(epoca.name)}
            className={`flex-row items-center justify-between gap-5 px-3 py-2 ${epoca.bgColor} ${epoca.borderColor} ${index > 0 ? "border-t" : ""}`}
          >
            <Text className={`font-Inter-Medium text-lg ${epoca.textColor}`}>{epoca.name}</Text>
            <HugeiconsIcon
              icon={epoca.icon}
              size={24}
              color={epoca.iconColor}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )
}
