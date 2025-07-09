import { Backward01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useNavigation } from "@react-navigation/native"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useUserCatchReports } from "querys"
import { useLayoutEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, TouchableHighlight } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStore } from "store"
import { RootStackNavigationProp } from "types/index"
import { useHeaderHeight } from "@react-navigation/elements"
import Animated, { FadeInUp } from "react-native-reanimated"

export default function CatchGalleryScreen() {
  const navigation = useNavigation<RootStackNavigationProp<"Gallery">>()
  const userId = useStore((state) => state.id)
  const userReports = useUserCatchReports(userId)
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: Platform.OS === "ios",
      headerBlurEffect: Platform.OS === "ios" ? "light" : undefined,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Platform.OS === "ios" ? "transparent" : "#effcf3",
      },
      headerBackVisible: false,

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-xl bg-[#14141c] p-2"
          style={{ marginLeft: 8 }}
        >
          <HugeiconsIcon
            icon={Backward01Icon}
            size={20}
            color="#14b981"
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ),

      headerTitle: () => (
        <Text className="font-Inter-Medium text-3xl">
          Catch <Text className="font-Inter-Black text-4xl text-emerald-500">Gallery</Text>
        </Text>
      ),

      headerTitleAlign: "center",
      headerShown: true,
      animation: "default",
    })
  }, [navigation])

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingTop: Platform.OS === "ios" ? headerHeight : 0,
        }}
      >
        <View className="flex-1 px-4 pt-4">
          <View className="flex-row flex-wrap justify-between gap-3">
            {userReports.isLoading ? (
              <ActivityIndicator size={"large"} />
            ) : (
              userReports.data?.map((report, index) => (
                <Animated.View
                  entering={FadeInUp.duration(600).delay(index * 100)}
                  style={{ width: "48.5%", aspectRatio: 1 / 1 }}
                  className="relative overflow-hidden rounded-2xl shadow-lg"
                  key={report.catch_id}
                >
                  <TouchableHighlight
                    onPress={() =>
                      navigation.navigate("CatchReport", {
                        catchReportId: report.catch_id,
                      })
                    }
                  >
                    <View style={{ width: "100%", height: "100%" }}>
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.4)"]}
                        className="absolute z-20 h-full w-full"
                      />
                      <Image
                        source={{
                          uri: `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${report.imagenes[0] || ""}`,
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        contentFit="cover"
                      />

                      <View className="absolute  bottom-3 left-3 right-3 z-30 h-fit flex-row flex-wrap items-center gap-2">
                        <BlurView
                          style={{
                            borderWidth: 1,
                            position: "relative",
                          }}
                          intensity={15}
                          tint="systemMaterialDark"
                          experimentalBlurMethod="dimezisBlurView"
                          className="relative overflow-hidden rounded-full border-gray-100/20 px-2 py-1"
                        >
                          <Text className="z-40 font-Inter-SemiBold text-sm text-green-200">{report.embalse}</Text>
                        </BlurView>

                        <BlurView
                          intensity={15}
                          tint="systemMaterialDark"
                          experimentalBlurMethod="dimezisBlurView"
                          style={{
                            borderWidth: 1,
                          }}
                          className="overflow-hidden rounded-full border-gray-100/20 px-2 py-1"
                        >
                          <Text className="z-40 font-Inter-SemiBold text-sm text-amber-200">
                            {new Date(report.fecha).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })}
                          </Text>
                        </BlurView>
                      </View>
                    </View>
                  </TouchableHighlight>
                </Animated.View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}
