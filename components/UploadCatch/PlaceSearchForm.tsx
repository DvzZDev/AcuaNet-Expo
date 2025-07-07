import { useState, useEffect, useMemo } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, findNodeHandle, ScrollView } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { useNominatim } from "querys"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Search01Icon, Location01Icon } from "@hugeicons/core-free-icons"
import NamesData from "../../lib/Names.json"
import Fuse from "fuse.js"

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

interface EmbalseResult {
  nombre: string
  pais: string
}

type SearchMode = "local" | "nominatim"

export default function PlaceSearchForm({ onLocationSelect, onInputFocus }: PlaceSearchProps) {
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<SearchMode>("local")
  const [localResults, setLocalResults] = useState<EmbalseResult[]>([])

  const fuse = useMemo(() => {
    const options = {
      keys: ["nombre"],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    }
    return new Fuse(NamesData, options)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    if (searchMode === "local" && debouncedSearchText.length > 2) {
      const fuseResults = fuse.search(debouncedSearchText)
      const filtered = fuseResults.slice(0, 5).map((result) => result.item)
      setLocalResults(filtered)
    } else {
      setLocalResults([])
    }
  }, [debouncedSearchText, searchMode, fuse])

  const { data, error, isLoading } = useNominatim(searchMode === "nominatim" ? debouncedSearchText : "")

  const handleSearch = (text: string) => {
    setSearchText(text)
    setIsSearching(text.length > 2)
  }

  const handleLocationSelect = (result: NominatimResult | EmbalseResult) => {
    let shortName: string
    if ("nombre" in result) {
      shortName = result.nombre
    } else {
      shortName = result.name || result.display_name.split(",")[0]
    }
    console.log("Seleccionando embalse:", shortName)
    onLocationSelect(shortName)
    setSearchText(shortName)
    setIsSearching(false)
  }

  const handleSwitchToNominatim = () => {
    setSearchMode("nominatim")
    setLocalResults([])
  }

  const handleSwitchToLocal = () => {
    setSearchMode("local")
  }

  const results = searchMode === "local" ? localResults : (data as NominatimResult[]) || []

  return (
    <View className="relative mt-2">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-Inter-Medium text-base text-green-950">
          {searchMode === "local" ? "Buscar embalse" : "Búsqueda global"}
        </Text>
        {searchMode === "local" ? (
          <TouchableOpacity onPress={handleSwitchToNominatim}>
            <Text className="font-Inter-Medium text-sm text-green-600 underline">¿No encuentras el embalse?</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSwitchToLocal}>
            <Text className="font-Inter-Medium text-sm text-green-600 underline">Volver a embalses</Text>
          </TouchableOpacity>
        )}
      </View>

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
          placeholder={searchMode === "local" ? "Buscar embalse..." : "Buscar ubicación..."}
          placeholderTextColor="#71947d"
          className="ios:leading-[0] ios:py-4 ml-2 flex-1 px-3 py-3 font-Inter-Medium text-base text-green-950"
        />
      </View>

      {isSearching && searchText.length > 2 && (
        <View className="absolute top-20 z-10 w-full rounded-lg border-lime-500 bg-lime-300 ">
          {searchMode === "nominatim" &&
          (isLoading || (debouncedSearchText !== searchText && searchText.length > 2)) ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator
                size="small"
                color="#3f6212"
              />
              <Text className="mt-2 font-Inter-Medium text-lime-800">Buscando...</Text>
            </View>
          ) : searchMode === "nominatim" && error ? (
            <View className="p-4">
              <Text className="font-Inter-Medium text-red-600">Error al buscar ubicaciones</Text>
            </View>
          ) : results.length > 0 ? (
            <ScrollView
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {results.map((item, index) => {
                const key = "nombre" in item ? `${item.nombre}-${index}` : item.place_id.toString()
                const displayText =
                  "nombre" in item ? `${item.nombre} (${item.pais})` : item.name || item.display_name.split(",")[0]

                return (
                  <TouchableOpacity
                    key={key}
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
                      {displayText}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          ) : (
            <View className="p-4">
              <Text className="font-Inter-Medium text-green-950">
                {searchMode === "local" ? "No se encontraron embalses" : "No se encontraron resultados"}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
