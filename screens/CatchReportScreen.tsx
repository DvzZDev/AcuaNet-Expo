import { Backward01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import ImageCarrousel from "components/CatchReport/ImageCarrousel"
import { LinearGradient } from "expo-linear-gradient"
import { useUserCatchReports } from "querys"
import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert, Dimensions } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStore } from "store"
import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect, useCallback } from "react"

import { useHeaderHeight } from "@react-navigation/elements"
import { supabase } from "lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import LunarReport from "@components/CatchReport/LunarReport"
import ReportComents from "@components/CatchReport/ReportComents"
import EmbStatusReport from "@components/CatchReport/EmbStatusReport"
import MapReport from "@components/CatchReport/MapReport"
import ChipsReport from "@components/CatchReport/ChipsReport"

export default function CatchReportPage({ route }: { route: any }) {
  const { catchReportId } = route.params
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const userId = useStore((state) => state.id)
  const allData = useUserCatchReports(userId)
  const data = allData.data?.find((report) => report.catch_id === catchReportId)
  const {
    catch_id,
    peso,
    comentarios,
    lat,
    lng,
    emb_data,
    profundidad,
    temperatura,
    tecnica,
    situacion,
    especie,
    fecha,
    embalse,
    imagenes,
  } = data || {}

  const handleDelete = useCallback(async () => {
    if (!catch_id) {
      Alert.alert("Error", "No se puede eliminar el reporte. Datos inválidos.")
      return
    }

    Alert.alert(
      "¿Eliminar CatchReport?",
      "Esta acción es permanente y no se puede revertir.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const { error } = await supabase.from("catch_reports").delete().eq("catch_id", catch_id)
              if (error) {
                console.error("Error al eliminar el reporte:", error)
                Alert.alert("Error", "No se pudo eliminar el reporte. Inténtalo más tarde.")
                return
              }

              navigation.goBack()

              await queryClient.invalidateQueries({ queryKey: ["userCatchReports", userId] })
              await queryClient.invalidateQueries({ queryKey: ["catchReports"] })

              console.log("Elemento eliminado")
            } catch (error) {
              console.error("Error inesperado:", error)
              Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo más tarde.")
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    )
  }, [catch_id, navigation, queryClient, userId])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: Platform.OS === "ios",
      headerBlurEffect: Platform.OS === "ios" ? "light" : undefined,
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
        <Text
          style={{
            fontSize: 25,
            fontFamily: "Inter-SemiBold",
            color: "#022c22",
            textAlign: "center",
            maxWidth: Dimensions.get("window").width * 0.6,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {embalse || "Reporte"}
        </Text>
      ),

      headerTitleAlign: "center",

      headerRight: () => (
        <TouchableOpacity
          onPress={() => handleDelete()}
          className="rounded-xl bg-red-100 p-2"
          style={{ marginRight: 8 }}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            size={20}
            color="red"
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ),

      headerShown: true,
      animation: "fade",
    })
  }, [navigation, embalse, handleDelete])

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Cargando...</Text>
      </View>
    )
  }

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingTop: Platform.OS === "ios" ? headerHeight : 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ImageCarrousel paths={imagenes} />
        <View className="m-4">
          <ChipsReport
            especie={especie || undefined}
            peso={peso || undefined}
            situacion={situacion || undefined}
            temperatura={temperatura || undefined}
            tecnica={tecnica || undefined}
            profundidad={profundidad ? Number(profundidad) : undefined}
            fecha={fecha ? new Date(fecha) : undefined}
          />

          <MapReport
            catch_id={catch_id}
            imagenes={imagenes && imagenes[0]}
            lat={lat}
            lng={lng}
          />

          {emb_data ? (
            <EmbStatusReport
              embalse={embalse || "n/d"}
              emb_data={emb_data}
              fecha={fecha ? new Date(fecha) : new Date()}
            />
          ) : null}

          <LunarReport date={fecha ? new Date(fecha) : new Date()} />

          {comentarios ? <ReportComents comentarios={comentarios} /> : null}
        </View>
      </ScrollView>
    </>
  )
}
