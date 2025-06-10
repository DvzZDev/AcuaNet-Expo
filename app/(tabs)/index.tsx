import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useState, useEffect } from "react"
import { getFavSections } from "querys"
import { supabase } from "lib/supabase"
import { FavSection } from "types/index"
import { Capitalice } from "lib/Capitalice"
import Spain from "@assets/icons/spain"
import Portugal from "@assets/icons/portugal"
import Animated, { FadeIn, useAnimatedStyle } from "react-native-reanimated"
import TrendUp from "@assets/icons/trendUp"
import TrendDown from "@assets/icons/trendDown"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Calendar01FreeIcons, TransactionHistoryFreeIcons } from "@hugeicons/core-free-icons"
import { router } from "expo-router"

// Función para procesar datos de España y calcular diferencias semanales
const processSpainData = (rawData: FavSection[]): FavSection[] => {
  const embalsesMap = new Map()

  // Agrupar por embalse
  rawData.forEach((item) => {
    if (!item.embalse || item.pais === "Portugal") return

    if (!embalsesMap.has(item.embalse)) {
      embalsesMap.set(item.embalse, [])
    }
    embalsesMap.get(item.embalse).push(item)
  })

  const processedData: FavSection[] = []

  // Procesar cada embalse
  embalsesMap.forEach((registros, embalse) => {
    // Ordenar por fecha descendente (más reciente primero)
    registros.sort((a: FavSection, b: FavSection) => {
      const dateA = new Date(a.fecha || 0)
      const dateB = new Date(b.fecha || 0)
      return dateB.getTime() - dateA.getTime()
    })

    const registroReciente = registros[0]
    const registroAnterior = registros[1]

    // Calcular diferencia semanal si hay 2 registros
    let variacionSemanal = 0
    if (registroAnterior && registroReciente.porcentaje && registroAnterior.porcentaje) {
      variacionSemanal = Number((registroReciente.porcentaje - registroAnterior.porcentaje).toFixed(2))
    }

    // Agregar la variación al registro más reciente
    processedData.push({
      ...registroReciente,
      variacion_ultima_semana: variacionSemanal,
    })
  })

  return processedData
}

export default function Page() {
  const hour = new Date().getHours()
  const [isLoading, setIsLoading] = useState(true)
  const [favData, setFavData] = useState<FavSection[]>([])

  console.log(favData)

  useEffect(() => {
    const fetchFavData = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error fetching session:", error)
          return
        }
        const id = data.session?.user.id
        if (!id) {
          console.error("User ID is undefined")
          return
        }
        const favData = await getFavSections(
          id,
          (rawData: FavSection[]) => {
            // Separar datos de España y Portugal
            const spainData = rawData.filter((item) => item.pais !== "Portugal")
            const portugalData = rawData.filter((item) => item.pais === "Portugal")

            // Procesar datos de España para calcular diferencias y mantener solo registros recientes
            const processedSpainData = processSpainData(spainData)

            // Combinar datos procesados
            const finalData = [...processedSpainData, ...portugalData]
            setFavData(finalData)
          },
          setIsLoading
        )
        return favData
      } catch (error) {
        console.error("Error fetching favorite data:", error)
      }
    }
    fetchFavData()
  }, [])

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-col items-center">
          <Text className="font-Inter-Medium text-3xl text-emerald-900">
            {hour < 12 ? "Buenos días" : hour < 21 ? "Buenas tardes" : "Buenas noches"},
          </Text>
          <Text className="w-full text-left font-Inter-Black-Italic text-4xl leading-relaxed text-[#14141c]">
            David
          </Text>
        </View>
        <Image
          style={{
            width: 100,
            height: 100,
            marginTop: 10,
            borderWidth: 2,
            borderColor: "#9affa1",
            borderRadius: 200,
          }}
          source={require("@assets/yo.png")}
        />
      </View>

      <View className="flex-col gap-5">
        <View className="mx-4 mt-[2rem] flex-row gap-2">
          <Text className="font-Inter-SemiBold text-3xl text-emerald-950">Embalses</Text>
          <Text className="font-Inter-Black text-3xl text-[#14141c]">Favoritos</Text>
        </View>

        <View>
          {favData.map((e, i) => (
            <Animated.View
              entering={FadeIn}
              key={i}
              className="mx-4 mb-4 rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2"
            >
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/embalse/${e.pais === "Portugal" ? e.nombre_embalse?.toLocaleLowerCase() : e.embalse}`
                  )
                }
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-Inter-Bold text-3xl text-emerald-950">
                    {e.pais === "Portugal" ? Capitalice(e.nombre_embalse ? e.nombre_embalse : "N/D") : e.embalse}
                  </Text>
                  {e.pais === "Portugal" ? <Portugal /> : <Spain />}
                </View>
                <View className="mt-4 flex-row items-center gap-2">
                  <View
                    style={{
                      height: 12,
                      backgroundColor: "#14141c",
                      borderRadius: 999,
                      position: "relative",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        height: "100%",
                        width: e.pais === "Portugal" ? `${e.agua_embalsadapor || 0}%` : `${e.porcentaje || 0}%`,
                        backgroundColor: "#00c740",
                        borderRadius: 999,
                      }}
                    />
                  </View>

                  <Text className="min-w-[50px] text-right font-Inter-Bold text-xl">
                    {e.pais === "Portugal"
                      ? `${e.agua_embalsadapor?.toFixed(0) || 0}%`
                      : `${e.porcentaje?.toFixed(0) || 0}%`}
                  </Text>
                </View>
                <View className="mt-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="font-Inter-Medium text-emerald-800">Var. Semanal: </Text>
                    {e.pais === "Portugal" ? (
                      e.variacion_ultima_semanapor && e.variacion_ultima_semanapor > 0 ? (
                        <TrendUp color="#16a34a" />
                      ) : (
                        <TrendDown color="#dc2626" />
                      )
                    ) : e.variacion_ultima_semana && e.variacion_ultima_semana > 0 ? (
                      <TrendUp color="#16a34a" />
                    ) : (
                      <TrendDown color="#dc2626" />
                    )}
                    <Text
                      className={
                        e.pais === "Portugal"
                          ? e.variacion_ultima_semanapor && e.variacion_ultima_semanapor > 0
                            ? "font-Inter-Bold text-green-600"
                            : "font-Inter-Bold text-red-600"
                          : e.variacion_ultima_semana && e.variacion_ultima_semana > 0
                            ? "font-Inter-Bold text-green-600"
                            : "font-Inter-Bold text-red-600"
                      }
                    >
                      {" "}
                      {e.pais === "Portugal" ? e.variacion_ultima_semanapor : e.variacion_ultima_semana}%
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1 rounded-3xl border border-lime-300 bg-lime-400 p-1 px-2">
                    <HugeiconsIcon
                      icon={TransactionHistoryFreeIcons}
                      size={15}
                      color="#1a2e05"
                    />
                    <Text className="font-Inter-Medium text-sm text-lime-950">
                      Ult. Boletin:{" "}
                      {e.pais === "Portugal"
                        ? new Date(e.fecha_modificacion || 0).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })
                        : new Date(e.fecha || 0).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </>
  )
}
