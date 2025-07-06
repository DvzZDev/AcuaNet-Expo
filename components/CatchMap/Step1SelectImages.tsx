import React from "react"
import { View } from "react-native"
import StepHeader from "./StepHeader"
import ImageDisplay from "./ImageDisplay"

interface Step1SelectImagesProps {
  images: string[]
  onPickImage: () => Promise<void>
  onChangeSelection: () => void
  onNext?: () => void
  canNext: boolean
  onLayout: (event: any) => void
  maxImages: number
}

export default function Step1SelectImages({
  images,
  onPickImage,
  onChangeSelection,
  onNext,
  canNext,
  onLayout,
  maxImages,
}: Step1SelectImagesProps) {
  return (
    <View
      onLayout={onLayout}
      className="px-2 pt-2"
    >
      <StepHeader
        stepNumber="1º"
        title="Seleccionar Imágenes"
        color="text-[#126ca1]"
        bgColor="bg-[#95d6fb]"
        animationSource={require("@assets/animations/Upload.json")}
        onNext={onNext}
        canNext={canNext}
      />
      <ImageDisplay
        images={images}
        onPickImage={onPickImage}
        onChangeSelection={onChangeSelection}
        maxImages={maxImages}
      />
    </View>
  )
}
