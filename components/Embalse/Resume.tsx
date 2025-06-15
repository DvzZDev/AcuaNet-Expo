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
  } | null
  fish_activity: any
}) {
  const [resume, setResume] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const hasCalledRef = useRef(false)

  useEffect(() => {
    if (!weather || !embalse?.embalse?.name) {
      setLoading(true)
      setError(false)
      hasCalledRef.current = false
      return
    }

    if (hasCalledRef.current) {
      return
    }

    const fetchResume = async () => {
      try {
        hasCalledRef.current = true
        setLoading(true)
        setError(false)

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
      <ScrollView
        className="h-full w-full px-2"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: loading ? "center" : "flex-start",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0a1d0e"
          />
        ) : (
          <Animated.Text
            entering={FadeIn}
            className="text-left font-Inter text-base"
          >
            {error ? "Ha sucedido un error" : resume}
          </Animated.Text>
        )}
      </ScrollView>
    </View>
  )
}
