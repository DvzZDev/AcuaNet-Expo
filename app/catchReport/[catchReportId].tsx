import { Backward01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import ImageCarrousel from "components/CatchReport/ImageCarrousel"
import { LinearGradient } from "expo-linear-gradient"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useUserCatchReports } from "querys"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStore } from "store"

export default function CatchReportPage() {
  const { catchReportId } = useLocalSearchParams()
  const userId = useStore((state) => state.id)
  const allData = useUserCatchReports(userId)
  const data = allData.data?.find((report) => report.catch_id === catchReportId)
  const { catch_id, fecha, embalse, imagenes } = data || {}
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + 80, paddingTop: insets.top + 5 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center gap-4 border-gray-300 bg-[#effcf3] px-4 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-xl bg-[#14141c] p-2"
          >
            <HugeiconsIcon
              icon={Backward01Icon}
              size={20}
              color="#14b981"
              strokeWidth={1.5}
            />
          </TouchableOpacity>
          <Text
            ellipsizeMode="clip"
            className="font-Inter-Medium text-3xl"
          >
            {embalse}
          </Text>
          <View className="ml-auto items-center justify-center rounded-xl bg-cyan-200 p-2">
            <Text className="font-Inter-Medium text-base ">
              {fecha
                ? new Date(fecha).toLocaleDateString("es-Es", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : ""}
            </Text>
          </View>
        </View>

        <View>
          <ImageCarrousel paths={imagenes} />
        </View>
      </ScrollView>
    </>
  )
}
