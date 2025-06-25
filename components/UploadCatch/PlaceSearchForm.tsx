import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, findNodeHandle } from "react-native"
import { TextInput, FlatList } from "react-native-gesture-handler"
import { useNominatim } from "querys"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Search01Icon, Location01Icon } from "@hugeicons/core-free-icons"

interface PlaceSearchProps {
  onLocationSelect: (embalse: string) => void
  onInputFocus?: (reactNode: any) => void
}

interface NominatimResult {
  place_id: number
  display_name: string
  name: string
  lat: string
  lon: string
  importance: number
}

export default function PlaceSearchForm({ onLocationSelect, onInputFocus }: PlaceSearchProps) {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchText])

  const { data, error, isLoading } = useNominatim(debouncedSearchText)

  const handleSearch = (text: string) => {
    setSearchText(text)
    setIsSearching(text.length > 2)
  }

  const handleLocationSelect = (result: NominatimResult) => {
    const shortName = result.name || result.display_name.split(",")[0]
    onLocationSelect(shortName)
    setSearchText(shortName)
    setIsSearching(false)
  }

  const results = (data as NominatimResult[]) || []

  return (
    <View className="relative mt-2">
      <View className="relative flex-row items-center rounded-lg border border-green-300 bg-green-200 px-3">
        <HugeiconsIcon
          icon={Search01Icon}
          size={20}
          color="#71947d"
        />
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          onFocus={(event) => {
            if (onInputFocus) {
              // @ts-ignore - findNodeHandle funciona con event.targetx
              onInputFocus(findNodeHandle(event.target))
            }
          }}
          placeholder="Buscar embalse..."
          placeholderTextColor="#71947d"
          className="ios:leading-[0] ios:py-4 ml-2 flex-1 px-3 py-3 font-Inter-Medium text-base text-green-950"
        />
      </View>

      {isSearching && searchText.length > 2 && (
        <View className="absolute top-14 z-10 w-full rounded-lg border-lime-500 bg-lime-300 ">
          {isLoading || (debouncedSearchText !== searchText && searchText.length > 2) ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator
                size="small"
                color="#3f6212"
              />
              <Text className="mt-2 font-Inter-Medium text-lime-800">Buscando...</Text>
            </View>
          ) : error ? (
            <View className="p-4">
              <Text className="font-Inter-Medium text-red-600">Error al buscar ubicaciones</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLocationSelect(item)}
                  className="flex-row items-center border-b border-green-400 p-3"
                >
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={16}
                    color="#3f6212"
                  />
                  <Text
                    className="ml-2 flex-1 font-Inter-Medium text-lime-800"
                    numberOfLines={2}
                  >
                    {item.name || item.display_name.split(",")[0]}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            />
          ) : (
            <View className="p-4">
              <Text className="font-Inter-Medium text-green-950">No se encontraron resultados</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
