import React from "react"
import { View } from "react-native"
import UploadStatus from "./UploadStatus"

interface Step5UploadStatusProps {
  isSending: boolean
  isSuccess: boolean
  isError: boolean
  onLayout: (event: any) => void
}

export default function Step5UploadStatus({ isSending, isSuccess, isError, onLayout }: Step5UploadStatusProps) {
  return (
    <View
      onLayout={onLayout}
      className="h-[17rem] px-2 pt-2"
    >
      <UploadStatus
        isSending={isSending}
        isSuccess={isSuccess}
        isError={isError}
      />
    </View>
  )
}
