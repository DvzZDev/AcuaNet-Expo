import {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { useEffect, useRef } from "react"
import { View } from "react-native"
import UploadImage from "./UploadImage"

export default function AddCatchBottomSheet({
  isOpen,
  setOpen,
}: {
  isOpen: boolean
  setOpen: (open: boolean) => void
}) {
  const BsRef = useRef<BottomSheetModal>(null)

  const CustomBackground = ({ style, ...props }: BottomSheetBackgroundProps) => (
    <View
      style={[
        style,
        {
          backgroundColor: "#dcfce7",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      ]}
      {...props}
    />
  )

  useEffect(() => {
    if (isOpen) {
      BsRef.current?.present()
    } else {
      BsRef.current?.dismiss()
    }
  }, [isOpen])

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
      ref={BsRef}
      onDismiss={() => setOpen(false)}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      backgroundComponent={CustomBackground}
    >
      <BottomSheetView className="pb-10">
        <UploadImage />
      </BottomSheetView>
    </BottomSheetModal>
  )
}
