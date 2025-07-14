import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { DropletIcon, Search02FreeIcons } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Names from "lib/Names.json"
import Fuse from "fuse.js"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import Spain from "@assets/icons/spain"
import Portugal from "@assets/icons/portugal"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "types/index"

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
  const [isTyping, setIsTyping] = useState(false)
  const navigation = useNavigation<RootStackNavigationProp<"Search">>()

  // 🧠 Memoized Fuse
  const fuse = useMemo(() => {
    return new Fuse(Names, {
      keys: ["nombre"],
      threshold: 0.4,
    })
  }, [])

  // 🧠 Memoized filtered names
  const FilteredNames = useMemo(() => {
    if (!value.trim()) return []
    const results = fuse.search(value).slice(0, 3)
    return results.map((result) => result.item)
  }, [value, fuse])

  const searchModalRef = useRef<BottomSheetModal>(null)

  const handleSearch = useCallback(() => {
    if (!value.trim()) return
    setHasSearched(true)

    if (FilteredNames.length > 0) {
      setIsModalVisible(false)
      setValue("")
      setHasSearched(false)
      navigation.navigate("Embalse", { embalse: FilteredNames[0].nombre })
      return
    }

    const exactMatch = Names.find((name: NamesType) => name.nombre.toLowerCase() === value.toLowerCase().trim())

    if (exactMatch) {
      setIsModalVisible(false)
      setValue("")
      setHasSearched(false)
      navigation.navigate("Embalse", { embalse: exactMatch.nombre })
    }
  }, [value, FilteredNames, setIsModalVisible, navigation])

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
      if (hasSearched) setHasSearched(false)

      setIsTyping(true)
      const typingTimeout = setTimeout(() => {
        setIsTyping(false)
      }, 300)

      return () => clearTimeout(typingTimeout)
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
        {/* Search input */}
        <View className="relative mb-6 rounded-2xl border border-green-200 bg-[#a8f2b76f]">
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
            placeholderTextColor="#dbfce2af"
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

        {FilteredNames.length > 0 &&
          (isTyping ? (
            <View className="mb-3 h-fit w-full rounded-2xl border border-green-200 bg-[#a8f2b76f]">
              {FilteredNames.map((name: NamesType, index: number) => (
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false)
                    setValue("")
                    setHasSearched(false)
                    navigation.navigate("Embalse", { embalse: name.nombre })
                  }}
                  key={index}
                  className={`flex-row items-center justify-between rounded-b-2xl p-2 ${
                    index < FilteredNames.length - 1 ? "border-b border-green-300" : ""
                  }`}
                >
                  <Text className="font-Inter-Medium text-green-200">{name.nombre}</Text>
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
            </View>
          ) : (
            <Animated.View
              // entering={FadeIn}
              // exiting={FadeOut}
              className="mb-3 h-fit w-full rounded-2xl border border-green-200 bg-[#a8f2b76f]"
            >
              {FilteredNames.map((name: NamesType, index: number) => (
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false)
                    setValue("")
                    setHasSearched(false)
                    navigation.navigate("Embalse", { embalse: name.nombre })
                  }}
                  key={index}
                  className={`flex-row items-center justify-between rounded-b-2xl p-2 ${
                    index < FilteredNames.length - 1 ? "border-b border-green-300" : ""
                  }`}
                >
                  <Text className="font-Inter-Medium text-green-200">{name.nombre}</Text>
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
          ))}

        {/* No results */}
        {hasSearched && FilteredNames.length === 0 && value.trim() && (
          <Animated.View
            // entering={FadeIn}
            // exiting={FadeOut}
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
  sheetContainer: {
    marginHorizontal: 50,
  },
})
