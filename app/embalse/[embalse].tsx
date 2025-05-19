/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, useLocalSearchParams } from "expo-router"
import { HistoricalData, LiveData } from "querys"
import { useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { EmbalseDataHistorical, EmbalseDataLive } from "../../types"
import Calendar from "@assets/icons/calendar"
import Ai from "@assets/icons/ai"
import { HugeiconsIcon } from "@hugeicons/react-native"
import DataModal from "components/Embalse/DataMoldal"
import {
  CalendarCheckIn01Icon,
  ChartLineData02FreeIcons,
  LiveStreaming02Icon,
  MapsLocation01Icon,
  MoonIcon,
  RainbowIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"

export default function Embalse() {
  const [hData, setHData] = useState<EmbalseDataHistorical[]>([])
  const [liveData, setLiveData] = useState<EmbalseDataLive[]>([])
  const [ContentKey, setContentKey] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const { embalse } = useLocalSearchParams()
  const codedEmbalse = Array.isArray(embalse) ? embalse[0] : embalse

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        await HistoricalData(embalse, codedEmbalse, setHData)
        await LiveData(embalse, codedEmbalse, setLiveData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Asegurar que los estados tengan valores válidos en caso de error
        setHData([])
        setLiveData([])
      }
    }
    fetchDataAsync()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTitleAlign: "center",
          contentStyle: {
            backgroundColor: "transparent",
            padding: 10,
          },
          headerStyle: {
            backgroundColor: "#effcf3",
          },
          headerBackVisible: true,
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <Image
              source={require("../../assets/Logo.png")}
              style={{
                width: 40,
                height: 40,
                marginLeft: "auto",
              }}
            />
          ),
          headerLeft: () => {
            const headerTitle = embalse ? (Array.isArray(embalse) ? embalse[0] : embalse) : "N/D"
            const truncateText = (text: string, maxLength: number = 18) => {
              return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
            }

            return (
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: "Inter-Black",
                  color: "#032E15",
                  paddingLeft: "auto",
                  maxWidth: 360,
                  lineHeight: 32,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(headerTitle)}
              </Text>
            )
          },
        }}
      />
      <LinearGradient
        colors={["#effcf3", "#acd9af"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-col justify-center gap-1">
          <Text className="font-Inter text-2xl text-[#032E15]">
            Cuanca del {hData && hData.length > 0 ? hData[0].cuenca : "N/A"}{" "}
          </Text>
          <View className="flex flex-row items-center justify-center gap-2">
            <Calendar />
            <Text className="font-Inter">
              Ult. Actualización -{" "}
              {hData && hData.length > 0
                ? new Date(hData[0].fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </Text>
          </View>
        </View>
        <HugeiconsIcon
          icon={StarIcon}
          size={40}
          fill="yellow"
          color={"orange"}
        />
      </View>

      <View className="mt-5 h-[12rem] w-full rounded-lg bg-green-300 p-2">
        <ScrollView>
          <Text className="font-Inter text-base">
            En los próximos días en la zona de El Atazar, las temperaturas oscilarán entre los 6°C y los 22°C. Prepárate
            para posibles lluvias el lunes y miércoles, con vientos que podrían alcanzar los 30 km/h el lunes por la
            tarde. A partir del jueves, el tiempo mejora con cielos parcialmente nublados y vientos más suaves. La luna
            llena de estos días favorece la actividad, especialmente hasta el miércoles. El embalse está casi a su
            máxima capacidad, con un 98% de llenado, lo que podría afectar el acceso a algunas áreas.
          </Text>
        </ScrollView>
      </View>
      <View className="ml-auto flex flex-row items-center justify-center gap-1 text-xs">
        <Ai />
        <Text className="font-Inter">AcuaNet AI puede cometer errores</Text>
      </View>

      <View className="mt-10 flex flex-col gap-5">
        <TouchableOpacity
          onPress={() => {
            setContentKey("livedata")
            setIsOpen(true)
          }}
          className="h-fit self-start rounded-lg border border-[#019FFF]/50 bg-[#bae5ff] p-2"
        >
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={LiveStreaming02Icon}
              size={30}
              color={"#019FFF"}
            />
            <Text className="font-Inter text-xl text-[#019FFF]">Datos en Tiempo Real</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setContentKey("weekdata")
            setIsOpen(true)
          }}
          className="h-fit self-start rounded-lg border border-[#008F06]/50 bg-[#BAFFBD] p-2"
        >
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={CalendarCheckIn01Icon}
              size={30}
              color={"#008F06"}
            />
            <Text className="font-Inter text-xl text-[#008F06]">Datos Semanales</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setContentKey("historicaldata")
            setIsOpen(true)
          }}
          className="h-fit self-start rounded-lg border border-[#C09400]/50 bg-[#EFFFBA] p-2"
        >
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={ChartLineData02FreeIcons}
              size={30}
              color={"#C09400"}
            />
            <Text className="font-Inter text-xl text-[#C09400]">Datos Historicos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#9000FF]/50 bg-[#E1BAFF] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={RainbowIcon}
              size={30}
              color={"#9000FF"}
            />
            <Text className="font-Inter text-xl text-[#9000FF]">Predicción Meteorológica</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#FF8900]/50 bg-[#FFDFBA] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={MapsLocation01Icon}
              size={30}
              color={"#FF8900"}
            />
            <Text className="font-Inter text-xl text-[#FF8900]">Mapas: Topográfico y de Viento</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#0051FF]/50 bg-[#BAD0FF] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon
              icon={MoonIcon}
              size={30}
              color={"#0051FF"}
            />
            <Text className="font-Inter text-xl text-[#0051FF]">Tabla Lunar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <DataModal
        LiveData={liveData && liveData.length > 0 ? liveData : []}
        HistoricalData={hData && hData.length > 0 ? hData : []}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentKey={ContentKey}
        setContentKey={setContentKey}
      />
    </>
  )
}
