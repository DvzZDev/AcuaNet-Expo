import {
  ArrowDown01FreeIcons,
  SlowWindsIcon,
  SunCloud02Icon,
  FastWindIcon,
  TimeQuarterIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useState, useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export default function DropDown({
  onSelect,
  initialValue = ["Condiciones", SunCloud02Icon],
}: {
  onSelect: (args: [string, any]) => void
  initialValue?: [string, any]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>(initialValue[0])
  const [selectedIcon, setSelectedIcon] = useState<any>(initialValue[1])

  useEffect(() => {
    if (initialValue) {
      setSelectedOption(initialValue[0])
      setSelectedIcon(initialValue[1])
    }
  }, [initialValue])

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
        className={`h-fit w-fit flex-row items-center justify-center  rounded-full bg-[#4a3954]/90 px-2 py-1 ${isOpen && "opacity-40"}`}
      >
        <Animated.View
          key={selectedOption}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <HugeiconsIcon
            icon={selectedIcon}
            size="24"
            color="#fce7f3"
          />
        </Animated.View>
        <HugeiconsIcon
          icon={ArrowDown01FreeIcons}
          size="24"
          color="#fce7f3"
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="absolute right-0 top-10 z-10 w-[12rem] rounded-lg bg-[#4a3954]/90 shadow-lg"
        >
          {(dropDownContent ?? []).map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(item.label)
                setSelectedIcon(item.icon)
                onSelect([item.label, item.icon])
                setIsOpen(false)
              }}
              key={index}
            >
              <View className={`flex-row items-center gap-2 border-[#7b5e8f] p-2 ${index === 3 ? "" : "border-b"}`}>
                {selectedOption === item.label ? (
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size="24"
                    color="#fce7f3"
                  />
                ) : (
                  <View style={{ width: 24, height: 24 }} />
                )}
                <Text className="flex-1 text-pink-100">{item.label}</Text>
                <HugeiconsIcon
                  icon={item.icon}
                  size="24"
                  color="#fce7f3"
                />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  )
}
