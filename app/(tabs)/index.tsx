import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, Text, View } from "react-native"
import { useState, useEffect } from "react"
import { getFavSections } from "querys"
import { FavSection } from "types/index"
import { ReorderableListReorderEvent, reorderItems } from "react-native-reorderable-list"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ReorderableEmbalseList from "components/ReorderableEmbalseList"
import { useStore } from "../../store"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { UserIcon } from "@hugeicons/core-free-icons"

const EMBALSE_ORDER_KEY = "@embalse_order"

const saveOrder = async (data: FavSection[]) => {
  try {
    const orderData = data.map((item, index) => ({
      key: `${item.pais}-${item.embalse || item.nombre_embalse}-${item.id || 0}`,
      index,
    }))
    await AsyncStorage.setItem(EMBALSE_ORDER_KEY, JSON.stringify(orderData))
  } catch (error) {
    console.error("Error saving order:", error)
  }
}

const loadOrder = async () => {
  try {
    const orderData = await AsyncStorage.getItem(EMBALSE_ORDER_KEY)
    return orderData ? JSON.parse(orderData) : null
  } catch (error) {
    console.error("Error loading order:", error)
    return null
  }
}

const applyStoredOrder = (data: FavSection[], storedOrder: any[]) => {
  if (!storedOrder || storedOrder.length === 0) return data
  const orderMap = new Map()
  storedOrder.forEach((item) => {
    orderMap.set(item.key, item.index)
  })

  return data.sort((a, b) => {
    const keyA = `${a.pais}-${a.embalse || a.nombre_embalse}-${a.id || 0}`
    const keyB = `${b.pais}-${b.embalse || b.nombre_embalse}-${b.id || 0}`

    const indexA = orderMap.get(keyA)
    const indexB = orderMap.get(keyB)

    if (indexA !== undefined && indexB !== undefined) {
      return indexA - indexB
    }
    if (indexA !== undefined) return -1
    if (indexB !== undefined) return 1
    return 0
  })
}

const processSpainData = (rawData: FavSection[]): FavSection[] => {
  const embalsesMap = new Map()

  rawData.forEach((item) => {
    if (!item.embalse || item.pais === "Portugal") return

    if (!embalsesMap.has(item.embalse)) {
      embalsesMap.set(item.embalse, [])
    }
    embalsesMap.get(item.embalse).push(item)
  })

  const processedData: FavSection[] = []

  embalsesMap.forEach((registros, embalse) => {
    registros.sort((a: FavSection, b: FavSection) => {
      const dateA = new Date(a.fecha || 0)
      const dateB = new Date(b.fecha || 0)
      return dateB.getTime() - dateA.getTime()
    })

    const registroReciente = registros[0]
    const registroAnterior = registros[1]

    let variacionSemanal = 0
    if (registroAnterior && registroReciente.porcentaje && registroAnterior.porcentaje) {
      variacionSemanal = Number((registroReciente.porcentaje - registroAnterior.porcentaje).toFixed(2))
    }

    processedData.push({
      ...registroReciente,
      variacion_ultima_semana: variacionSemanal,
    })
  })

  return processedData
}

export default function Page() {
  const userId = useStore((state) => state.id)
  const hour = new Date().getHours()
  const [favData, setFavData] = useState<FavSection[]>([])
  const avatarUrl = useStore((state) => state.avatarUrl)

  useEffect(() => {
    const fetchFavData = async () => {
      try {
        if (!userId) {
          console.log("Waiting for user ID from store...")
          return
        }

        const favData = await getFavSections(
          userId,
          async (rawData: FavSection[]) => {
            const spainData = rawData.filter((item) => item.pais !== "Portugal")
            const portugalData = rawData.filter((item) => item.pais === "Portugal")
            const processedSpainData = processSpainData(spainData)
            const combinedData = [...processedSpainData, ...portugalData]
            const storedOrder = await loadOrder()
            const finalData = applyStoredOrder(combinedData, storedOrder)

            setFavData(finalData)
          },
          () => {}
        )
        return favData
      } catch (error) {
        console.error("Error fetching favorite data:", error)
      }
    }

    fetchFavData()
  }, [userId])

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setFavData((prevData) => {
      const newData = reorderItems(prevData, from, to)
      saveOrder(newData)
      return newData
    })
  }

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-col items-center">
          <Text className="font-Inter-Medium text-3xl text-emerald-900">
            {hour < 12 ? "Buenos días" : hour <= 21 ? "Buenas tardes" : "Buenas noches"},
          </Text>
          <Text className="w-full text-left font-Inter-Black-Italic text-5xl leading-[4rem] text-[#14141c]">David</Text>
        </View>
        <View className="relative">
          <View
            style={{
              width: 90,
              height: 90,
              marginTop: 10,
              borderWidth: 2,
              borderColor: "#a855f7",
              borderRadius: 20,
              backgroundColor: "#f3f4f6",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {avatarUrl ? (
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={{ uri: avatarUrl }}
                transition={300}
                contentFit="cover"
              />
            ) : (
              <HugeiconsIcon
                icon={UserIcon}
                size={40}
                color="#a855f7"
              />
            )}
          </View>

          <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex-row items-center justify-center rounded-full bg-purple-500 px-2 py-1">
            <Text className="font-Inter-SemiBold text-xs text-white">Premium</Text>
          </View>
        </View>
      </View>

      <View className="flex-col gap-5">
        <View className="mx-4 mt-[2rem] flex-row gap-2">
          <Text className="font-Inter-SemiBold text-3xl text-emerald-950">Embalses</Text>
          <Text className="font-Inter-Black text-3xl text-[#14141c]">Favoritos</Text>
        </View>

        <ReorderableEmbalseList
          data={favData}
          onReorder={handleReorder}
        />
      </View>
    </>
  )
}
