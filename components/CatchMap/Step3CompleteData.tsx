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
  embalseData,
  coordinates,
  onPrev,
  onNext,
  onLayout,
  catchReportRef,
}: Step3CompleteDataProps) {
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
        setEmbalse={setEmbalse}
        embalseData={embalseData}
        coordinates={coordinates}
      />
    </View>
  )
}
