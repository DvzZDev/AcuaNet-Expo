import { ExchangeIcon, Image01FreeIcons, ImageUploadIcon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"

export default function ImageDisplay({
  images,
  onPickImage,
  onChangeSelection,
  maxImages,
}: {
  images: string[]
  onPickImage: () => void
  onChangeSelection: () => void
  maxImages?: number
}) {
  if (images.length === 0) {
    return (
      <TouchableOpacity
        onPress={onPickImage}
        className="relative mx-2 mt-4 h-[30vh] items-center justify-center rounded-2xl bg-emerald-900 px-8"
      >
        <HugeiconsIcon
          icon={ImageUploadIcon}
          size={50}
          color="#9affa1"
        />
        <Text className="mt-4 text-center font-Inter-Medium text-[#9affa1]">Seleccionar imagen</Text>
        <View className="absolute right-4 top-4 flex-row items-center justify-center gap-1 rounded-xl bg-[#141c1c] p-2 px-3">
          <HugeiconsIcon
            icon={Image01FreeIcons}
            size={13}
            color="#9affa1"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Medium text-xs text-[#9affa1]">0/{maxImages}</Text>
        </View>
        <View className="absolute bottom-4 flex-row items-center justify-center gap-2 rounded-xl bg-[#14141c] px-7 py-3">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={20}
            color="#9affa1"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Medium text-xs text-[#9affa1]">
            La primera imagen que selecciones será la principal y se usará para determinar la ubicación y la fecha.
            Puedes subir un máximo de {maxImages} imágenes.
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View className="mx-2 space-y-4">
      <View className="relative h-[30vh] items-center justify-center overflow-hidden rounded-2xl bg-emerald-900">
        <Image
          source={{ uri: images[0] }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
        {images.length > 1 && (
          <View className="absolute bottom-0 left-0 right-0">
            <View className="flex-row flex-wrap gap-2 p-2">
              {images.slice(1).map((uri, index) => (
                <View
                  key={index}
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: "#8eeb95",
                    aspectRatio: 1,
                  }}
                  className="w-[20%] overflow-hidden rounded-lg"
                >
                  <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        )}
        <View className="absolute right-4 top-4 flex-row items-center justify-center gap-1 rounded-xl bg-[#141c1c] p-2 px-3">
          <HugeiconsIcon
            icon={Image01FreeIcons}
            size={13}
            color="#9affa1"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Medium text-xs text-[#9affa1]">
            {images.length}/{maxImages}
          </Text>
        </View>
        {maxImages && images.length < maxImages && (
          <TouchableOpacity
            onPress={onPickImage}
            className="absolute right-4 top-14 flex-row items-center gap-1 rounded-lg bg-green-200 p-1"
          >
            <HugeiconsIcon
              icon={ImageUploadIcon}
              size={20}
              color="#16a34a"
            />
            <Text className="font-Inter-Medium text-sm text-green-700">Añadir más</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={onChangeSelection}
        className="mt-3 flex-row items-center justify-center gap-1 rounded-lg bg-orange-200 p-3"
      >
        <HugeiconsIcon
          icon={ExchangeIcon}
          size={25}
          color="#fb923c"
        />
        <Text className="text-center font-Inter-SemiBold text-lg text-orange-400">Cambiar selección</Text>
      </TouchableOpacity>
    </View>
  )
}
