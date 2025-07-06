import React from "react"
import { ActivityIndicator, Text, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import LottieView from "lottie-react-native"

export default function UploadStatus({
  isSending,
  isSuccess,
  isError,
}: {
  isSending: boolean
  isSuccess: boolean
  isError: boolean
}) {
  if (isSending) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator
          size="large"
          color="#4f46e5"
        />
        <Text className="mt-4 font-Inter-SemiBold text-2xl text-gray-700">Subiendo captura...</Text>
      </Animated.View>
    )
  }

  if (isSuccess) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="flex-1 items-center justify-center"
      >
        <LottieView
          source={require("@assets/animations/Success.json")}
          autoPlay
          loop={false}
          style={{ width: 150, height: 150 }}
        />
        <Text className="font-Inter-SemiBold text-2xl text-green-700">¡Captura subida con éxito!</Text>
      </Animated.View>
    )
  }

  if (isError) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="flex-1 items-center justify-center"
      >
        <LottieView
          source={require("@assets/animations/Error.json")}
          autoPlay
          loop={true}
          style={{ width: 180, height: 180 }}
        />
        <Text className="px-4 text-center font-Inter-SemiBold text-xl text-red-700">
          Ha sucedido un error, si el error persiste contacta con el desarrollador.
        </Text>
      </Animated.View>
    )
  }

  return (
    <Animated.View
      entering={FadeIn}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center justify-center">
        <Text className="font-Inter-SemiBold text-xl text-gray-600">Preparando envío...</Text>
        <Text className="mt-2 text-center font-Inter-Medium text-gray-500">La captura se enviará automáticamente</Text>
      </View>
    </Animated.View>
  )
}
