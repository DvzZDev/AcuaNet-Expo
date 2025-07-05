import React, { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { TransactionHistoryFreeIcons } from "@hugeicons/core-free-icons"
import { FavSection } from "types/index"
import { Capitalice } from "lib/Capitalice"
import TrendUp from "@assets/icons/trendUp"
import TrendDown from "@assets/icons/trendDown"
import PortugalCard from "@assets/icons/portugalCard"
import SpainCard from "@assets/icons/spainCard"
import { useNavigation } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"

interface ReorderableEmbalseListProps {
  data: FavSection[]
  onReorder: (data: FavSection[]) => void
}

const EmbalseCard: React.FC<RenderItemParams<FavSection>> = memo(({ item: embalse, drag, isActive }) => {
  const navigation = useNavigation<NavigationProp<any>>()
  return (
    <ScaleDecorator>
      <View className="relative mx-4 mb-4 w-[17rem] overflow-hidden rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2">
        {embalse.pais === "Portugal" ? <PortugalCard /> : <SpainCard />}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              `/embalse/${embalse.pais === "Portugal" ? embalse.nombre_embalse?.toLocaleLowerCase() : embalse.embalse}`
            )
          }
          onLongPress={drag}
          disabled={isActive}
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-Inter-Bold text-[1.7rem] text-emerald-950">
              {embalse.pais === "Portugal"
                ? Capitalice(embalse.nombre_embalse ? embalse.nombre_embalse : "N/D")
                : embalse.embalse}
            </Text>
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
              <Text className="font-Inter-Medium text-sm text-emerald-800">Var. Semanal: </Text>
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
                      ? "font-Inter-Bold text-sm text-green-600"
                      : "font-Inter-Bold text-sm text-red-600"
                    : embalse.variacion_ultima_semana && embalse.variacion_ultima_semana > 0
                      ? "font-Inter-Bold text-sm text-green-600"
                      : "font-Inter-Bold text-sm text-red-600"
                }
              >
                {" "}
                {embalse.pais === "Portugal" ? embalse.variacion_ultima_semanapor : embalse.variacion_ultima_semana}%
              </Text>
            </View>

            <View className="flex-row items-center gap-1 rounded-3xl bg-lime-400/50 p-1 px-2">
              <HugeiconsIcon
                icon={TransactionHistoryFreeIcons}
                size={15}
                color="#1a2e05"
              />
              <Text className="font-Inter-Medium text-sm text-lime-800">
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
    </ScaleDecorator>
  )
})

const ReorderableEmbalseList: React.FC<ReorderableEmbalseListProps> = ({ data, onReorder }) => {
  const renderItem = (params: RenderItemParams<FavSection>) => <EmbalseCard {...params} />

  return (
    <DraggableFlatList
      data={data}
      horizontal={true}
      onDragEnd={({ data }) => onReorder(data)}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.pais}-${item.embalse || item.nombre_embalse}-${item.id || 0}`}
    />
  )
}

export default ReorderableEmbalseList
