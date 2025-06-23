import {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { useEffect, useRef, useCallback } from "react"
import { View } from "react-native"
import UploadImage from "./UploadImage"

const CustomBackgroundComponent = ({ style, ...props }: BottomSheetBackgroundProps) => (
  <View
    style={[style, { backgroundColor: "#dcfce7", borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}
    {...props}
  />
)

export default function AddCatchBottomSheet({
  isOpen,
  setOpen,
}: {
  isOpen: boolean
  setOpen: (open: boolean) => void
}) {
  const BsRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (isOpen) {
      BsRef.current?.present()
    } else {
      BsRef.current?.dismiss()
    }
  }, [isOpen])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        pressBehavior="close"
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      ref={BsRef}
      onDismiss={() => setOpen(false)}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={CustomBackgroundComponent}
      enableDynamicSizing
    >
      <BottomSheetView className="pb-10">
        <UploadImage />
      </BottomSheetView>
    </BottomSheetModal>
  )
}
