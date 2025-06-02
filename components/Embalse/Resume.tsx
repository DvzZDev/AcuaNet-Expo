import { simpleGeminiAI } from "querys"
import { useState, useEffect, useRef } from "react"
import { ActivityIndicator, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeIn } from "react-native-reanimated"
import { getNext7DaysFishingActivity } from "lib/fishingActivity"

export default function Resume({
  weather,
  embalse,
  fish_activity,
}: {
  weather: any
  embalse: {
    embalse: {
      name: string
      nivel: number
      porcentaje: number
    }
  }
  fish_activity: any
}) {
  const [resume, setResume] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const hasCalledRef = useRef(false)

  useEffect(() => {
    if (hasCalledRef.current || !weather || !embalse?.embalse?.name) {
      return
    }

    const fetchResume = async () => {
      try {
        hasCalledRef.current = true
        setLoading(true)

        // Calcular actividad de pesca para los próximos 7 días
        const fishingActivity = getNext7DaysFishingActivity(weather)

        const result = await simpleGeminiAI(weather, embalse, fishingActivity)
        setResume(result)
      } catch (err) {
        console.error("Exception in Resume:", err)
        setError(true)
        hasCalledRef.current = false
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [weather, embalse, fish_activity])
  return (
    <View className="mt-5 h-[12rem] w-full rounded-lg bg-green-200 p-2">
      <ScrollView className="h-full w-full px-2">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color="#86efac"
            />
          </View>
        ) : (
          <Animated.Text
            entering={FadeIn}
            className="font-Inter text-base"
          >
            {error ? "Ha sucedido un error" : resume}
          </Animated.Text>
        )}
      </ScrollView>
    </View>
  )
}
