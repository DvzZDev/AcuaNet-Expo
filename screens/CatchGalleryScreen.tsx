import { AlbumIcon, Backward01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useNavigation } from "@react-navigation/native"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useUserCatchReports } from "querys"
import { useLayoutEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, TouchableHighlight } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStore } from "store"
import { RootStackNavigationProp } from "types/index"
import { useHeaderHeight } from "@react-navigation/elements"
import Animated, { FadeInUp, FadeOut, LinearTransition, SequencedTransition } from "react-native-reanimated"
import DropDownFilers from "@components/CatchReport/DropDownFilers"

export default function CatchGalleryScreen() {
  const navigation = useNavigation<RootStackNavigationProp<"Gallery">>()
  const userId = useStore((state) => state.id)
  const userReports = useUserCatchReports(userId)
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()

  const [filters, setFilters] = useState({
    createdAt: null,
    capturedAt: null,
    especie: null,
    embalse: null,
  })

  const handleFilterChange = (filterData: [string, any]) => {
    const [key, value] = filterData
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  console.log("Active filters in CatchGallery:", filters)

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
        <View className="flex-1 px-4 ">
          <View className="mb-4 mt-2 flex-row items-center justify-between">
            <View className="relative">
              <DropDownFilers onSelect={handleFilterChange} />
            </View>
            <View className="flex-row items-center gap-1 rounded-2xl bg-slate-300 px-2 py-1">
              <HugeiconsIcon
                icon={AlbumIcon}
                size={20}
                color="black"
              />
              <Text className="font-Inter-Black text-xl">{userReports.data?.length || 0} </Text>
            </View>
          </View>

          <Animated.View
            layout={SequencedTransition}
            className="flex-row flex-wrap justify-between gap-3"
          >
            {userReports.isLoading ? (
              <ActivityIndicator size={"large"} />
            ) : (
              userReports.data
                ?.filter((report) => {
                  return (
                    (filters.especie ? report.especie === filters.especie : true) &&
                    (filters.embalse ? report.embalse === filters.embalse : true)
                  )
                })
                ?.sort((a, b) => {
                  if (filters.createdAt === "asc") {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  } else if (filters.createdAt === "desc") {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  } else if (filters.capturedAt === "asc") {
                    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                  } else if (filters.capturedAt === "desc") {
                    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                  }
                  return 0
                })
                ?.map((report, index) => (
                  <Animated.View
                    layout={SequencedTransition}
                    entering={FadeInUp.duration(600).delay(index * 100)}
                    exiting={FadeOut.duration(300)}
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

                        <View className="absolute bottom-3 left-3 right-3 z-30 h-fit flex-row flex-wrap items-center gap-2">
                          <View className="relative flex-row items-center gap-1 overflow-hidden">
                            <BlurView
                              style={{
                                borderWidth: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                              }}
                              intensity={Platform.OS === "ios" ? 15 : 0}
                              experimentalBlurMethod="dimezisBlurView"
                              className="relative overflow-hidden rounded-full px-2 py-1"
                            >
                              <Text className="z-40 font-Inter-SemiBold text-sm text-green-200">{report.embalse}</Text>
                            </BlurView>

                            <BlurView
                              intensity={Platform.OS === "ios" ? 15 : 0}
                              experimentalBlurMethod="dimezisBlurView"
                              style={{
                                borderWidth: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                              }}
                              className="overflow-hidden rounded-full px-2 py-1"
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
                      </View>
                    </TouchableHighlight>
                  </Animated.View>
                ))
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </>
  )
}
