import React, { useEffect } from "react"
import { View } from "react-native"
import StepHeader from "./StepHeader"
import HistoricalDataDisplay from "./HistoricalDataRecover"
import { type GPSCoordinates } from "lib/extractGPSCoordinates"

interface Step4HistoricalDataProps {
  coordinates: GPSCoordinates | null
  userCoordinates: GPSCoordinates | null
  images: string[]
  embalse: string | null
  data: any
  imageDate: string | null
  isLoading: boolean
  onPrev: () => void
  onNext?: () => void
  canNext: boolean
  onLayout: (event: any) => void
}

export default function Step4HistoricalData({
  coordinates,
  userCoordinates,
  images,
  embalse,
  data,
  imageDate,
  isLoading,
  onPrev,
  onNext,
  canNext,
  onLayout,
}: Step4HistoricalDataProps) {
  useEffect(() => {
    console.log("Step4HistoricalData - embalse:", embalse)
    console.log(
      "Step4HistoricalData - data disponible:",
      data ? (Array.isArray(data) ? data.length : "objeto") : "no data"
    )
  }, [embalse, data])

  return (
    <View
      onLayout={onLayout}
      className="px-2 pt-2"
    >
      <StepHeader
        stepNumber="4º"
        title="Recuperación Históricos"
        color="text-[#ff0000]"
        bgColor="bg-[#ffbaba]"
        animationSource={require("@assets/animations/Historical.json")}
        onPrev={onPrev}
        onNext={onNext}
        canNext={canNext}
        showSend={true}
      />
      <HistoricalDataDisplay
        data={data}
        imageDate={imageDate}
        isLoading={isLoading}
        embalse={embalse}
      />
    </View>
  )
}
