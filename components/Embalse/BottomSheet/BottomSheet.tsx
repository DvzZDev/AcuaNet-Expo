import type { EmbalseDataLive, EmbalseDataHistorical, EmbalseDataPortugal } from "types"
import { useRef, useEffect } from "react"
import { Text, View } from "react-native"
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackgroundProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  ChartLineData02FreeIcons,
  LiveStreaming02Icon,
  RainbowIcon,
  MapsLocation01Icon,
  MoonIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import LiveDataTable from "../ContentModal/LiveDataTable"
import WeekData from "../ContentModal/WeekData"
import Chart from "../ContentModal/Chart"
import Weather from "../Weather"
import Maps from "../ContentModal/Maps"
import LunarCalendar from "../ContentModal/LunarCalendar"

const getBgColor = (contentKey: string) => {
  switch (contentKey) {
    case "livedata":
      return "#003352"
    case "weekdata":
      return "#dbfce7"
    case "historicaldata":
      return "#1c1f01"
    case "weatherForecast":
      return "#270541"
    case "maps":
      return "#fedeb9"
    case "lunarTable":
      return "#020533"
    default:
      return "#444"
  }
}

const getTitleBg = (contentKey: string) => {
  switch (contentKey) {
    case "livedata":
      return { borderColor: "#019FFF80", backgroundColor: "#bae5ff" }
    case "weekdata":
      return { borderColor: "#008F0680", backgroundColor: "#baffbd" }
    case "historicaldata":
      return { borderColor: "#C0940080", backgroundColor: "#EFFFBA" }
    case "weatherForecast":
      return { borderColor: "#9000FF80", backgroundColor: "#E1BAFF" }
    case "maps":
      return { borderColor: "#FF890080", backgroundColor: "#FFDFBA" }
    case "lunarTable":
      return { borderColor: "#0051FF80", backgroundColor: "#BAD0FF" }
    default:
      return { borderColor: "#ccc", backgroundColor: "#eee" }
  }
}

const getIcon = (contentKey: string) => {
  switch (contentKey) {
    case "livedata":
      return LiveStreaming02Icon
    case "weekdata":
      return ChartLineData02FreeIcons
    case "historicaldata":
      return ChartLineData02FreeIcons
    case "weatherForecast":
      return RainbowIcon
    case "maps":
      return MapsLocation01Icon
    case "lunarTable":
      return MoonIcon
    default:
      return null
  }
}

const getIconColor = (contentKey: string) => {
  switch (contentKey) {
    case "livedata":
      return "#019FFF"
    case "weekdata":
      return "#008f00"
    case "historicaldata":
      return "#C09400"
    case "weatherForecast":
      return "#9000FF"
    case "maps":
      return "#FF8900"
    case "lunarTable":
      return "#0051FF"
    default:
      return "#333"
  }
}

const getWildcard = (contentKey: string) => {
  if (contentKey === "livedata") return "Datos no contrastados"
  if (contentKey === "weekdata") return "Datos Contrastados"
  return null
}

const CustomBackground = ({ style, contentKey }: BottomSheetBackgroundProps & { contentKey: string }) => (
  <View
    className="flex-1 rounded-t-[30px]"
    style={[
      {
        backgroundColor: getBgColor(contentKey),
      },
      style,
    ]}
  />
)

interface BottomSheetModalComponentProps {
  open: boolean
  setOpen: (open: boolean) => void
  contentKey: string
  setContentKey: (key: string) => void
  LiveData: EmbalseDataLive[]
  HistoricalData: EmbalseDataHistorical[]
  PortugalData: EmbalseDataPortugal[]
  weatherData: any
  coords?: { latitude: number; longitude: number; pais: string }
  embalse?: string
  codedEmbalse?: string
}

export default function BottomSheetModalComponent({
  open,
  setOpen,
  contentKey,
  setContentKey,
  LiveData,
  PortugalData,
  HistoricalData,
  weatherData,
  coords,
}: BottomSheetModalComponentProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [open])

  const title =
    contentKey === "livedata"
      ? "Datos en Tiempo Real"
      : contentKey === "weekdata"
        ? "Datos Semanales"
        : contentKey === "historicaldata"
          ? "Datos Históricos"
          : contentKey === "weatherForecast"
            ? "Predicción Meteorológica"
            : contentKey === "maps"
              ? "Mapas: Topográfico y de Viento"
              : "Tabla Lunar"

  const wildcard = getWildcard(contentKey)
  const icon = getIcon(contentKey)
  const iconColor = getIconColor(contentKey)
  const titleBg = getTitleBg(contentKey)

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      enableTouchThrough={false}
      pressBehavior="close"
    />
  )

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ backgroundColor: getIconColor(contentKey) }}
      ref={bottomSheetModalRef}
      enableDynamicSizing={contentKey !== "maps"}
      snapPoints={contentKey === "maps" ? ["90%"] : undefined}
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backgroundComponent={(props) => (
        <CustomBackground
          {...props}
          contentKey={contentKey}
        />
      )}
      onDismiss={() => {
        setOpen(false)
        setContentKey("")
      }}
    >
      {contentKey && (
        <BottomSheetView
          className={`flex-1 rounded-t-[30px] ${contentKey === "lunarTable" || contentKey === "maps" ? "px-0" : "px-4"} relative`}
          style={{
            backgroundColor: getBgColor(contentKey),
            paddingBottom: contentKey === "maps" ? 0 : Math.max(insets.bottom, 30),
          }}
        >
          {contentKey === "maps" ? (
            <Maps coords={coords} />
          ) : (
            <>
              {/* Title */}
              <View className={`flex-row gap-2 ${contentKey === "lunarTable" ? "ml-4" : ""}`}>
                <View
                  className="flex-row items-center gap-1.5 self-start rounded-[10px] border p-1"
                  style={{
                    ...titleBg,
                  }}
                >
                  {icon && (
                    <HugeiconsIcon
                      icon={icon}
                      size={20}
                      color={iconColor}
                    />
                  )}
                  <Text
                    className="font-['Inter'] text-base"
                    style={{ color: iconColor }}
                  >
                    {title}
                  </Text>
                </View>
                {wildcard && (
                  <View
                    className="my-auto ml-2 self-start rounded-[10px] border px-1.5 py-0.5"
                    style={{
                      borderColor: contentKey === "weekdata" ? "#0072FF80" : "#FF880080",
                      backgroundColor: contentKey === "weekdata" ? "#BEDBFF" : "#FFD6A7",
                    }}
                  >
                    <Text
                      className="font-['Inter'] text-[13px]"
                      style={{
                        color: contentKey === "weekdata" ? "#008F06" : "#FF8800",
                      }}
                    >
                      {wildcard}
                    </Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <LiveDataTable
                liveData={LiveData}
                contentKey={contentKey}
              />
              <WeekData
                liveData={LiveData}
                historicalData={HistoricalData}
                contentKey={contentKey}
                pais={coords?.pais || ""}
                portugalData={PortugalData}
              />
              {contentKey === "historicaldata" && <Chart data={HistoricalData} />}
              {contentKey === "weatherForecast" && <Weather data={weatherData} />}
              {contentKey === "lunarTable" && <LunarCalendar />}
            </>
          )}
        </BottomSheetView>
      )}
    </BottomSheetModal>
  )
}
