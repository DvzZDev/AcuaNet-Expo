import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { DropletIcon, Search02FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Names from "lib/Names.json"
import Fuse from "fuse.js"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import Spain from "@assets/icons/spain"
import Portugal from "@assets/icons/portugal"
import { router } from "expo-router"

type SearchModalProps = {
  isVisible: boolean
  setIsModalVisible: (visible: boolean) => void
}

interface NamesType {
  nombre: string
  pais: string
}

export default function SearchModal({ isVisible, setIsModalVisible }: SearchModalProps) {
  const [value, setValue] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const fuse = new Fuse(Names, {
    keys: ["nombre"],
    threshold: 0.4,
  })

  const results = fuse.search(value).slice(0, 3)
  const FilteredNames = results.map((result) => result.item)

  const handleSearch = useCallback(() => {
    if (value.trim()) {
      setHasSearched(true)

      if (FilteredNames.length > 0) {
        setIsModalVisible(false)
        setValue("")
        setHasSearched(false)
        router.push(`/embalse/${FilteredNames[0].nombre}`)
        return
      }

      const exactMatch = Names.find((name: NamesType) => name.nombre.toLowerCase() === value.toLowerCase().trim())

      if (exactMatch) {
        setIsModalVisible(false)
        setValue("")
        setHasSearched(false)
        router.push(`/embalse/${exactMatch.nombre}`)
      }
    }
  }, [value, FilteredNames, setIsModalVisible])

  const searchModalRef = useRef<BottomSheetModal>(null)
  const handlePresentModalPress = useCallback(() => {
    searchModalRef.current?.present()
  }, [])
  const handleDismissModalPress = useCallback(() => {
    setIsModalVisible(false)
    setValue("")
    setHasSearched(false)
  }, [setIsModalVisible])

  const handleInputChange = useCallback(
    (text: string) => {
      setValue(text)
      if (hasSearched) {
        setHasSearched(false)
      }
    },
    [hasSearched]
  )

  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress()
    } else {
      searchModalRef.current?.dismiss()
    }
  }, [isVisible, handlePresentModalPress])

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
      ref={searchModalRef}
      index={0}
      style={styles.sheetContainer}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      bottomInset={100}
      backdropComponent={renderBackdrop}
      detached={true}
      keyboardBehavior="interactive"
      onDismiss={handleDismissModalPress}
      backgroundStyle={{ backgroundColor: "#14141c60" }}
      handleIndicatorStyle={{ backgroundColor: "#a5e73a" }}
      name="SearchModal"
    >
      <BottomSheetView className="px-5">
        <View className="relative mb-6 rounded-2xl border border-green-200 bg-[#a8f2b76f] ">
          <TouchableOpacity
            onPress={handleSearch}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
          >
            <HugeiconsIcon
              icon={Search02FreeIcons}
              size={20}
              color="#dbfce7"
            />
          </TouchableOpacity>
          <BottomSheetTextInput
            value={value}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            className="mx-9 w-fit py-4 font-Inter-Medium text-lg leading-[1.4rem] text-green-200"
            placeholderTextColor={"#dbfce2af"}
            placeholderClassName="Inter-Regular"
            placeholder="Buscar embalse..."
          />
          <View className="absolute left-2 top-1/2 -translate-y-1/2">
            <HugeiconsIcon
              icon={DropletIcon}
              size={20}
              color="#dbfce7"
            />
          </View>
        </View>

        {FilteredNames.length > 0 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="mb-3 h-fit w-full rounded-2xl border border-green-200 bg-[#a8f2b76f]"
          >
            {FilteredNames.map((name: NamesType, index: number) => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false)
                  setValue("")
                  setHasSearched(false)
                  router.push(`/embalse/${name.nombre}`)
                }}
                key={index}
                className={`flex-row items-center justify-between rounded-b-2xl p-2 ${index < FilteredNames.length - 1 ? "border-b border-green-300" : ""}`}
              >
                <Text
                  key={index}
                  className="font-Inter-Medium text-green-200"
                >
                  {name.nombre}
                </Text>

                {name.pais === "España" ? (
                  <Spain
                    height={20}
                    width={20}
                  />
                ) : (
                  <Portugal
                    height={20}
                    width={20}
                  />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {hasSearched && FilteredNames.length === 0 && value.trim() && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="mb-3 h-fit w-full rounded-2xl border border-red-200 bg-[#f2a8a86f] p-4"
          >
            <Text className="text-center font-Inter-Medium text-red-200">
              No se encontraron resultados para &quot;{value}&quot;
            </Text>
            <Text className="font-Inter-Regular mt-2 text-center text-sm text-red-100">
              Intenta con otro nombre de embalse
            </Text>
          </Animated.View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  sheetContainer: {
    marginHorizontal: 50,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
})
