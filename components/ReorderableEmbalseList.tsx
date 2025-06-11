import React, { memo } from "react"
import { ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import ReorderableList, { ReorderableListReorderEvent, useReorderableDrag } from "react-native-reorderable-list"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { TransactionHistoryFreeIcons } from "@hugeicons/core-free-icons"
import { FavSection } from "types/index"
import { Capitalice } from "lib/Capitalice"
import Spain from "@assets/icons/spain"
import Portugal from "@assets/icons/portugal"
import TrendUp from "@assets/icons/trendUp"
import TrendDown from "@assets/icons/trendDown"

interface ReorderableEmbalseListProps {
  data: FavSection[]
  onReorder: ({ from, to }: ReorderableListReorderEvent) => void
}

const EmbalseCard: React.FC<FavSection> = memo((embalse) => {
  const drag = useReorderableDrag()

  return (
    <View className="mx-4 mb-4 rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2">
      <TouchableOpacity
        onPress={() =>
          router.push(
            `/embalse/${embalse.pais === "Portugal" ? embalse.nombre_embalse?.toLocaleLowerCase() : embalse.embalse}`
          )
        }
        onLongPress={drag}
      >
        <View className="flex-row items-center justify-between">
          <Text className="font-Inter-Bold text-3xl text-emerald-950">
            {embalse.pais === "Portugal"
              ? Capitalice(embalse.nombre_embalse ? embalse.nombre_embalse : "N/D")
              : embalse.embalse}
          </Text>
          {embalse.pais === "Portugal" ? (
            <Portugal
              height={35}
              width={35}
            />
          ) : (
            <Spain
              height={35}
              width={35}
            />
          )}
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
                width:
                  embalse.pais === "Portugal" ? `${embalse.agua_embalsadapor || 0}%` : `${embalse.porcentaje || 0}%`,
                backgroundColor: "#00c740",
                borderRadius: 999,
              }}
            />
          </View>

          <Text className="min-w-[50px] text-right font-Inter-Bold text-xl">
            {embalse.pais === "Portugal"
              ? `${embalse.agua_embalsadapor?.toFixed(0) || 0}%`
              : `${embalse.porcentaje?.toFixed(0) || 0}%`}
          </Text>
        </View>
        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="font-Inter-Medium text-emerald-800">Var. Semanal: </Text>
            {embalse.pais === "Portugal" ? (
              embalse.variacion_ultima_semanapor && embalse.variacion_ultima_semanapor > 0 ? (
                <TrendUp color="#16a34a" />
              ) : (
                <TrendDown color="#dc2626" />
              )
            ) : embalse.variacion_ultima_semana && embalse.variacion_ultima_semana > 0 ? (
              <TrendUp color="#16a34a" />
            ) : (
              <TrendDown color="#dc2626" />
            )}
            <Text
              className={
                embalse.pais === "Portugal"
                  ? embalse.variacion_ultima_semanapor && embalse.variacion_ultima_semanapor > 0
                    ? "font-Inter-Bold text-green-600"
                    : "font-Inter-Bold text-red-600"
                  : embalse.variacion_ultima_semana && embalse.variacion_ultima_semana > 0
                    ? "font-Inter-Bold text-green-600"
                    : "font-Inter-Bold text-red-600"
              }
            >
              {" "}
              {embalse.pais === "Portugal" ? embalse.variacion_ultima_semanapor : embalse.variacion_ultima_semana}%
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
              {embalse.pais === "Portugal"
                ? new Date(embalse.fecha_modificacion || 0).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })
                : new Date(embalse.fecha || 0).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
})

const ReorderableEmbalseList: React.FC<ReorderableEmbalseListProps> = ({ data, onReorder }) => {
  const renderItem = ({ item }: ListRenderItemInfo<FavSection>) => <EmbalseCard {...item} />

  return (
    <ReorderableList
      data={data}
      onReorder={onReorder}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.pais}-${item.embalse || item.nombre_embalse}-${item.id || 0}`}
    />
  )
}

export default ReorderableEmbalseList
