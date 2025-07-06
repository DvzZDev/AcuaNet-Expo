import { View, Text } from "react-native"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"

export default function ReportComents({ comentarios }: { comentarios: string }) {
  return (
    <View className="mt-8">
      <View className="mb-3 self-start rounded-2xl bg-sky-900 px-2 py-1">
        <Text className="font-Inter-SemiBold text-lg text-sky-200">Tus comentarios</Text>
      </View>
      <ScrollView
        className="max-h-32 rounded-2xl bg-sky-200"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <Text className="px-4 pt-3 font-Inter-Medium text-lg leading-relaxed text-sky-800">{comentarios}</Text>
      </ScrollView>
    </View>
  )
}
