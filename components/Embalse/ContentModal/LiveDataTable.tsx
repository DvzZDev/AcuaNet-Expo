import { Text, View } from "react-native"
import type { EmbalseDataLive } from "types"

export default function LiveDataTable({
  liveData,
  contentKey,
  embalse,
  codedEmbalse,
}: {
  liveData: EmbalseDataLive[]
  contentKey: string
  embalse?: string
  codedEmbalse?: string
}) {
  return (
    <View className={`mt-4 flex w-full flex-col ${contentKey === "livedata" ? "block" : "hidden"}`}>
      {/* Table Header */}
      <View className="mb-2 flex w-full flex-row justify-between">
        {
          <>
            <View className="flex-1">
              <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">Hora</Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">Volumen</Text>
              <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(hm3)</Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">Capacidad</Text>
              <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(%)</Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">Cota</Text>
              <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(msnm)</Text>
            </View>
          </>
        }
      </View>
      {/* Table Rows */}
      {liveData?.length > 0 ? (
        liveData?.map((d) => (
          <View
            key={d.id}
            className="mb-1 flex w-full flex-row items-center justify-between rounded-lg border-b border-blue-800 bg-[#044c77]/60 p-1"
          >
            <View className="flex-1">
              <Text className="text-center font-Inter text-base text-[#D9F5FF]">
                {new Date(d.timestamp).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-base text-[#D9F5FF]">{d.volumen}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-base text-[#D9F5FF]">{d.porcentaje}%</Text>
            </View>
            <View className="flex-1">
              <Text className="text-center font-Inter text-base text-[#D9F5FF]">{d.cota}</Text>
            </View>
          </View>
        ))
      ) : (
        <View className="p-2">
          <Text className="text-center font-Inter text-base text-[#D9F5FF]">No hay datos disponibles</Text>
        </View>
      )}
    </View>
  )
}
