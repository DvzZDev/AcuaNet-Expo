import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import LottieView from "lottie-react-native"
import { Text, TouchableOpacity, View } from "react-native"

interface StepHeaderProps {
  stepNumber: string
  title: string
  color: string
  bgColor: string
  animationSource: any
  onPrev?: () => void
  onNext?: () => void
  canNext?: boolean
  showSend?: boolean
}

export default function StepHeader({
  stepNumber,
  title,
  color,
  bgColor,
  animationSource,
  onPrev,
  onNext,
  canNext = true,
  showSend = false,
}: StepHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className={`ml-2 flex-row items-center self-start rounded-lg p-1 px-2 ${bgColor}`}>
        <Text className={`font-Inter-Medium text-lg ${color}`}>
          {stepNumber} {title}
        </Text>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={{ width: 34, height: 25 }}
        />
      </View>
      <View className="flex-row items-center">
        {onPrev && (
          <TouchableOpacity
            onPress={onPrev}
            className="mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#fbd495] p-2"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={20}
              color="#7a5f00"
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}
        {onNext && (
          <TouchableOpacity
            onPress={onNext}
            className={`mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg p-2 ${
              canNext ? "bg-[#95fb97]" : "bg-gray-300 opacity-50"
            }`}
            disabled={!canNext}
          >
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color={canNext ? "#0c4607" : "#6b7280"}
              strokeWidth={2}
            />
            {showSend && (
              <Text className={`font-Inter-Medium text-sm ${canNext ? "text-[#0c4607]" : "text-gray-500"}`}>
                Enviar
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
