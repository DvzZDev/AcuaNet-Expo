import React from "react"
import { View } from "react-native"
import StepHeader from "./StepHeader"
import { CatchReport, type CatchReportRef } from "components/UploadCatch/CatchReport"
import { type GPSCoordinates } from "lib/extractGPSCoordinates"

interface Step3CompleteDataProps {
  imageDate: string | null
  setImageDate: (date: string | null) => void
  onInputFocus: (reactNode: any) => void
  images: string[]
  setIsSending: (value: boolean) => void
  setIsSuccess: (value: boolean) => void
  setIsError: (value: boolean) => void
  setEmbalse: (value: string | null) => void
  setEpoca: (value: string | null) => void
  epoca: string | null
  embalseData: any
  coordinates: GPSCoordinates | null
  onPrev: () => void
  onNext: () => void
  onLayout: (event: any) => void
  catchReportRef: React.RefObject<CatchReportRef | null>
}

export default function Step3CompleteData({
  imageDate,
  setImageDate,
  onInputFocus,
  images,
  setIsSending,
  setIsSuccess,
  setIsError,
  setEmbalse,
  setEpoca,
  epoca,
  embalseData,
  coordinates,
  onPrev,
  onNext,
  onLayout,
  catchReportRef,
}: Step3CompleteDataProps) {
  // Esto garantiza que cada vez que el usuario cambie el embalse en el CatchReport
  // se actualiza correctamente el estado en el componente padre
  const handleEmbalseChange = (embalseValue: string | null) => {
    console.log("Embalse cambiado a:", embalseValue)
    setEmbalse(embalseValue)
  }

  return (
    <View
      onLayout={onLayout}
      className="px-2 pt-2"
    >
      <StepHeader
        stepNumber="3º"
        title="Completar Datos"
        color="text-[#9000FF]"
        bgColor="bg-[#E1BAFF]"
        animationSource={require("@assets/animations/Edit.json")}
        onPrev={onPrev}
        onNext={onNext}
      />
      <CatchReport
        ref={catchReportRef}
        date={imageDate || undefined}
        setDate={setImageDate}
        onInputFocus={onInputFocus}
        images={images}
        setIsSending={setIsSending}
        setIsSuccess={setIsSuccess}
        setIsError={setIsError}
        setEmbalse={handleEmbalseChange}
        setEpoca={setEpoca}
        epocaValue={epoca}
        embalseData={embalseData}
        coordinates={coordinates}
      />
    </View>
  )
}
