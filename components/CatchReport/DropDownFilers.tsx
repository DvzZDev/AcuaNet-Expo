import { ArrowDown01FreeIcons, ArrowUp01FreeIcons, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { useState } from "react"
import { Text, TouchableOpacity, View, TextInput } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import NamesData from "../../lib/Names.json"

export default function DropDownFilters({ onSelect }: { onSelect?: (args: [string, any]) => void }) {
  interface FiltersState {
    createdAt: "asc" | "desc" | null
    capturedAt: "asc" | "desc" | null
    especie: string | null
    embalse: string | null
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isEspecieOpen, setIsEspecieOpen] = useState(false)
  const [isEmbalseOpen, setIsEmbalseOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<FiltersState>({
    createdAt: null,
    capturedAt: null,
    especie: null,
    embalse: null,
  })

  const ESPECIES_PESCA = [
    { name: "Black Bass", image: require("assets/bass.png") },
    { name: "Lucio", image: require("assets/lucio.png") },
    { name: "Lucio Perca", image: require("assets/lucioperca.png") },
    { name: "Perca", image: require("assets/perca.png") },
    { name: "Carpa", image: require("assets/carpa.png") },
    { name: "Barbo", image: require("assets/barbo.png") },
    { name: "Siluro", image: require("assets/siluro.png") },
  ]

  const toggleOrden = (key: "createdAt" | "capturedAt") => {
    setFilters((prev) => {
      const current = prev[key]
      const next = current === "asc" ? "desc" : current === "desc" ? null : "asc"
      const otherKey = key === "createdAt" ? "capturedAt" : "createdAt"

      const newFilters = {
        ...prev,
        [key]: next,
        [otherKey]: null,
      }

      onSelect?.([key, next])

      return newFilters
    })
  }

  const selectEspecie = (especie: string) => {
    setFilters((prev) => {
      const newValue = prev.especie === especie ? null : especie
      onSelect?.(["especie", newValue])
      return {
        ...prev,
        especie: newValue,
      }
    })
    setIsEspecieOpen(false)
  }

  const selectEmbalse = (embalse: string) => {
    setFilters((prev) => {
      const newValue = prev.embalse === embalse ? null : embalse
      onSelect?.(["embalse", newValue])
      return {
        ...prev,
        embalse: newValue,
      }
    })
    setIsEmbalseOpen(false)
    setSearchText("")
  }

  const filteredEmbalses = NamesData.filter((embalse) =>
    embalse.nombre.toLowerCase().includes(searchText.toLowerCase())
  ).slice(0, 5)

  const activeFiltersCount = Object.values(filters).filter((value) => value !== null).length

  const clearAllFilters = () => {
    const clearedFilters = {
      createdAt: null,
      capturedAt: null,
      especie: null,
      embalse: null,
    }
    setFilters(clearedFilters)
    Object.keys(clearedFilters).forEach((key) => {
      onSelect?.([key, null])
    })
  }

  return (
    <View className="relative">
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className={`h-fit w-fit flex-row items-center justify-center rounded-full bg-slate-300 px-2 py-1 ${isOpen ? "opacity-40" : ""}`}
        >
          <Text className="font-Inter-SemiBold text-xl text-gray-800">Filtros</Text>
          {activeFiltersCount > 0 && (
            <View className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
              <Text className="font-Inter-Bold text-xs text-white">{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {activeFiltersCount > 0 && (
          <TouchableOpacity
            onPress={clearAllFilters}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={16}
              color="white"
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}
      </View>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          className="absolute left-0 top-10 z-10 w-[15rem] overflow-hidden rounded-lg shadow-lg"
        >
          <BlurView
            intensity={60}
            experimentalBlurMethod="dimezisBlurView"
            tint="extraLight"
            className="relative"
          >
            <View className="bg-white/10">
              <TouchableOpacity
                onPress={() => toggleOrden("createdAt")}
                className="flex-row items-center justify-between border-gray-400 p-2"
                style={{ borderBottomWidth: 1 }}
              >
                <Text className="font-Inter-Medium text-lg text-gray-800">Fecha de creación</Text>
                {filters.createdAt === "asc" ? (
                  <HugeiconsIcon
                    icon={ArrowUp01FreeIcons}
                    size={20}
                    color="black"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                ) : filters.createdAt === "desc" ? (
                  <HugeiconsIcon
                    icon={ArrowDown01FreeIcons}
                    size={20}
                    color="black"
                  />
                ) : null}
              </TouchableOpacity>
            </View>

            <View className="bg-white/10">
              <TouchableOpacity
                onPress={() => toggleOrden("capturedAt")}
                className="flex-row items-center justify-between border-gray-400 p-2"
                style={{ borderBottomWidth: 1 }}
              >
                <Text className="font-Inter-Medium text-lg text-gray-800">Fecha de captura</Text>
                {filters.capturedAt === "asc" ? (
                  <HugeiconsIcon
                    icon={ArrowUp01FreeIcons}
                    size={20}
                    color="black"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                ) : filters.capturedAt === "desc" ? (
                  <HugeiconsIcon
                    icon={ArrowDown01FreeIcons}
                    size={20}
                    color="black"
                  />
                ) : null}
              </TouchableOpacity>
            </View>

            <View className="bg-white/10">
              <TouchableOpacity
                onPress={() => setIsEspecieOpen(!isEspecieOpen)}
                className="flex-row items-center justify-between border-gray-400 p-2"
                style={{ borderBottomWidth: 1 }}
              >
                <Text className="font-Inter-Medium text-lg text-gray-800">Especie</Text>
                {filters.especie ? (
                  <View className="flex-row items-center">
                    <Image
                      source={ESPECIES_PESCA.find((e) => e.name === filters.especie)?.image}
                      style={{ width: 40, height: 20 }}
                      contentFit="contain"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setFilters((prev) => ({ ...prev, especie: null }))
                        onSelect?.(["especie", null])
                      }}
                      className="ml-1 rounded-full bg-red-500 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={12}
                        color="white"
                        strokeWidth={3}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <HugeiconsIcon
                    icon={isEspecieOpen ? ArrowUp01FreeIcons : ArrowDown01FreeIcons}
                    size={20}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>

            {isEspecieOpen && (
              <BlurView
                className="border-t border-gray-400"
                intensity={60}
                experimentalBlurMethod="dimezisBlurView"
                tint="extraLight"
              >
                {ESPECIES_PESCA.map((especie) => (
                  <TouchableOpacity
                    key={especie.name}
                    onPress={() => selectEspecie(especie.name)}
                    className={`flex-row items-center justify-between border-b border-gray-400 p-2 ${filters.especie === especie.name ? "bg-blue-100" : ""}`}
                  >
                    <Text className="font-Inter-Medium text-base text-gray-800">{especie.name}</Text>
                    <Image
                      source={especie.image}
                      style={{ width: 50, height: 20 }}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            )}

            <View className="bg-white/10">
              <TouchableOpacity
                onPress={() => setIsEmbalseOpen(!isEmbalseOpen)}
                className="flex-row items-center justify-between p-2"
              >
                <Text className="font-Inter-Medium text-lg text-gray-800">Embalse</Text>
                {filters.embalse ? (
                  <View className="flex-row items-center">
                    <Text className="mr-1 font-Inter-Medium text-sm text-gray-600">{filters.embalse}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setFilters((prev) => ({ ...prev, embalse: null }))
                        onSelect?.(["embalse", null])
                      }}
                      className="rounded-full bg-red-500 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={12}
                        color="white"
                        strokeWidth={3}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <HugeiconsIcon
                    icon={isEmbalseOpen ? ArrowUp01FreeIcons : ArrowDown01FreeIcons}
                    size={20}
                    color="black"
                  />
                )}
              </TouchableOpacity>
            </View>

            {isEmbalseOpen && (
              <BlurView
                className="border-t border-gray-400"
                intensity={60}
                experimentalBlurMethod="dimezisBlurView"
                tint="extraLight"
              >
                <View className="border-b border-gray-400 p-2">
                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Buscar embalse..."
                    className="rounded-lg bg-white/50 px-3 py-2 font-Inter-Medium text-base text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {filteredEmbalses.map((embalse) => (
                  <TouchableOpacity
                    key={embalse.nombre}
                    onPress={() => selectEmbalse(embalse.nombre)}
                    className={`flex-row items-center justify-between border-b border-gray-400 p-2 ${filters.embalse === embalse.nombre ? "bg-blue-100" : ""}`}
                  >
                    <Text className="font-Inter-Medium text-base text-gray-800">{embalse.nombre}</Text>
                    <Text className="font-Inter-Regular text-sm text-gray-500">{embalse.pais}</Text>
                  </TouchableOpacity>
                ))}

                {filteredEmbalses.length === 0 && searchText && (
                  <View className="p-2">
                    <Text className="text-center font-Inter-Medium text-base text-gray-500">
                      No se encontraron embalses
                    </Text>
                  </View>
                )}
              </BlurView>
            )}
          </BlurView>
        </Animated.View>
      )}
    </View>
  )
}
