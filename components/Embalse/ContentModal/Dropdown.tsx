import {
  ArrowDown01FreeIcons,
  SlowWindsIcon,
  SunCloud02Icon,
  FastWindIcon,
  TimeQuarterIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export default function DropDown({ onSelect }: { onSelect: (option: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")

  const dropDownContent = [
    {
      icon: SunCloud02Icon,
      label: "Condiciones",
    },
    {
      icon: FastWindIcon,
      label: "Viento",
    },
    {
      icon: TimeQuarterIcon,
      label: "Presion",
    },
    {
      icon: SlowWindsIcon,
      label: "Humedad",
    },
  ]

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="h-fit w-fit flex-row items-center justify-center gap-1 rounded-full bg-[#4a3954]/90 p-1"
      >
        <Animated.View
          key={selectedOption}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <HugeiconsIcon
            icon={dropDownContent.find((item) => item.label === selectedOption)?.icon ?? SunCloud02Icon}
            size="24"
            color="pink"
          />
        </Animated.View>
        <HugeiconsIcon
          icon={ArrowDown01FreeIcons}
          size="24"
          color="#dfb9d3"
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="absolute right-0 top-12 z-10 w-[12rem] rounded-lg bg-[#4a3954]/90 shadow-lg"
        >
          {(dropDownContent ?? []).map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(item.label)
                onSelect?.(item.label)
                setIsOpen(false)
              }}
              key={index}
            >
              <View className={`flex-row items-center gap-2 border-[#7b5e8f] p-2 ${index === 3 ? "" : "border-b"}`}>
                {selectedOption === item.label || (!selectedOption && index === 0) ? (
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size="24"
                    color="#dfb9d3"
                  />
                ) : (
                  <View style={{ width: 24, height: 24 }} />
                )}
                <Text className="flex-1 text-pink-100">{item.label}</Text>
                <HugeiconsIcon
                  icon={item.icon}
                  size="24"
                  color="#dfb9d3"
                />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  )
}
