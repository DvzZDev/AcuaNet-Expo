import {
  Analytics03Icon,
  Calendar03FreeIcons,
  DropletIcon,
  GoBackward10SecIcon,
  OneCircleIcon,
  RulerIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  getSameWeekLast10YearsAverage,
  getSameWeekLast10YearsAveragePercentage,
  getSameWeekLastYearCapacity,
  LastWeekVariation,
} from "lib/EmbHistorical"
import { Text, View } from "react-native"
import type { EmbalseDataLive, EmbalseDataHistorical } from "types"

export default function WeekData({
  historicalData,
  liveData,
  contentKey,
}: {
  historicalData: EmbalseDataHistorical[]
  liveData: EmbalseDataLive[]
  contentKey: string
}) {
  return (
    <View
      className={`${contentKey === "weekdata" ? "flex" : "hidden"} mt-3 flex-col items-center justify-center gap-6 `}
    >
      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={DropletIcon}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Agua Embalsada</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {historicalData.length > 0 ? historicalData[0].volumen_actual : "N/A"}
            <Text className="font-Inter-SemiBold text-base "> hm³</Text>
          </Text>
          <View
            style={{
              marginTop: 4,
              height: 12,
              backgroundColor: "#00c740",
              borderRadius: 999,
              position: "relative",
            }}
          >
            <View
              style={{
                position: "absolute",
                right: 0,
                height: "100%",
                width: 8,
                backgroundColor: "black",
                borderRadius: 999,
              }}
            />
          </View>
          <Text className="mt-2 font-Inter-Bold text-lg text-[#3D7764] ">
            {historicalData.length > 0 ? historicalData[0].porcentaje : "N/A"}
            <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
          </Text>
        </View>
      </View>

      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={RulerIcon}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Capacidad Total</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {historicalData.length > 0 ? historicalData[0].capacidad_total : "N/A"}
            <Text className="font-Inter-Medium text-base"> hm³</Text>
          </Text>
        </View>
      </View>

      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={Analytics03Icon}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Nivel (Cota)</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {liveData.length > 0 ? liveData[0].cota : "N/A"}
            <Text className="font-Inter-Medium text-base"> msnm</Text>
          </Text>
        </View>
      </View>

      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={Calendar03FreeIcons}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Cambios Semanales</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {historicalData.length > 1 ? LastWeekVariation(historicalData).lastWeek : "N/A"}
            <Text className="font-Inter-Medium text-base"> hm³</Text>
          </Text>
          <Text className="font-Inter-Bold text-lg text-[#3D7764] ">
            {historicalData.length > 0 ? LastWeekVariation(historicalData).pctDifference : "N/A"}
            <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
          </Text>
        </View>
      </View>

      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={OneCircleIcon}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Hace un año</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {historicalData.length > 1 ? getSameWeekLastYearCapacity(historicalData)?.vol : "N/A"}
            <Text className="font-Inter-Medium text-base"> hm³</Text>
          </Text>
          <Text className="font-Inter-Bold text-lg text-[#3D7764] ">
            {historicalData.length > 0 ? getSameWeekLastYearCapacity(historicalData)?.por : "N/A"}
            <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
          </Text>
        </View>
      </View>

      <View className="flex w-full flex-row items-center gap-6">
        <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
          <HugeiconsIcon
            icon={GoBackward10SecIcon}
            size={40}
            color="black"
          />
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <Text className="font-Inter text-xl font-semibold text-[#3D7764]">Hace 10 años</Text>
          <Text className="font-Inter-Black text-4xl  text-[#032e15]">
            {historicalData.length > 1 ? getSameWeekLast10YearsAverage(historicalData) : "N/A"}
            <Text className="font-Inter-Medium text-base"> hm³</Text>
          </Text>
          <Text className="font-Inter-Bold text-lg text-[#3D7764] ">
            {historicalData.length > 0 ? getSameWeekLast10YearsAveragePercentage(historicalData) : "N/A"}
            <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
