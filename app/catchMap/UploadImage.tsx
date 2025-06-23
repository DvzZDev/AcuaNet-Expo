/* eslint-disable react-hooks/exhaustive-deps */
import "react-native-get-random-values"
import React, { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, Text, Platform, Dimensions } from "react-native"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ExchangeIcon,
  ImageUploadIcon,
  MapsEditingIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { Image } from "expo-image"
import MapView, { Marker } from "react-native-maps"
import LottieView from "lottie-react-native"
import PlaceSearch from "components/UploadCatch/PlaceSearch"
import { extractGPSFromImagePicker, extractGPSFromDocument, type GPSCoordinates } from "lib/extractGPSCoordinates"
import { twMerge } from "tailwind-merge"
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"

const { width } = Dimensions.get("window")

export default function UploadImage() {
  const [image, setImage] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<GPSCoordinates | null>(null)
  const [userCoordinates, setUserCoordinates] = useState<GPSCoordinates | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const mapRef = useRef<MapView>(null)
  const carouselRef = useRef<any>(null)

  const [heights, setHeights] = useState([0, 0, 0])

  const heightAnim = useSharedValue(0)

  useEffect(() => {
    if (heights[currentStep]) {
      heightAnim.value = withTiming(heights[currentStep], { duration: 200 })
    }
  }, [currentStep, heights])

  useEffect(() => {
    if (userCoordinates && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userCoordinates.lat,
          longitude: userCoordinates.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
        1500
      )
    }
  }, [userCoordinates])

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }))

  const goToNextStep = () => {
    if (currentStep < 2) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      carouselRef.current?.scrollTo({ index: nextStep, animated: true })
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      carouselRef.current?.scrollTo({ index: prevStep, animated: true })
    }
  }

  const onStepChange = (index: number) => {
    setCurrentStep(index)
  }

  const onLayoutStep = (index: number) => (event: any) => {
    const h = event.nativeEvent.layout.height
    setHeights((prev) => {
      if (prev[index] === h) return prev
      const newHeights = [...prev]
      newHeights[index] = h
      return newHeights
    })
  }

  const renderStep1 = () => (
    <View
      onLayout={onLayoutStep(0)}
      className="px-2 pt-2"
    >
      <View className="flex-row items-center justify-between">
        <View className="mx-2 mb-3 self-start rounded-lg bg-[#95d6fb] p-1 px-2">
          <Text className="font-Inter-Medium text-lg text-[#126ca1]">1º Seleccionar Imagen</Text>
        </View>
        <TouchableOpacity
          onPress={goToNextStep}
          className={`mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#95fb97] p-2 ${!image ? "opacity-50" : "opacity-100"}`}
          disabled={!image}
        >
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            color={image ? "#0c4607" : "#6b7280"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {image ? (
        <View className="mx-2 space-y-4">
          <View className="h-[30vh] items-center justify-center overflow-hidden rounded-2xl bg-emerald-900">
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity
            onPress={pickImage}
            className="mt-3 flex-row items-center justify-center gap-1 rounded-lg bg-orange-200 p-3"
          >
            <HugeiconsIcon
              icon={ExchangeIcon}
              size={25}
              color="#fb923c"
            />
            <Text className="text-center font-Inter-SemiBold text-lg text-orange-400">Cambiar imagen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="mx-2 h-[30vh] items-center justify-center rounded-2xl bg-emerald-900 px-8"
        >
          <HugeiconsIcon
            icon={ImageUploadIcon}
            size={50}
            color="#9affa1"
          />
          <Text className="mt-4 text-center font-Inter-Medium text-[#9affa1]">Seleccionar imagen</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderStep2 = () => (
    <View
      onLayout={onLayoutStep(1)}
      className="px-2 pt-2"
    >
      <View className="flex-row items-center justify-between">
        <View className="ml-2 flex-row items-center self-start rounded-lg bg-[#95d6fb] p-1 px-2">
          <Text className="font-Inter-Medium text-lg text-[#126ca1]">2º Verificar Ubicación</Text>
          <LottieView
            source={require("@assets/animations/Location.json")}
            autoPlay
            loop
            style={{ width: 34, height: 25 }}
          />
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={goToPrevStep}
            className="mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#fbd495] p-2"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={20}
              color="#7a5f00"
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextStep}
            className="mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#95fb97] p-2"
          >
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color="#0c4607"
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {coordinates ? (
        <View className="mx-2 gap-3">
          <View className="self-start rounded-lg bg-green-200 p-1 px-2">
            <Text className="font-Inter-Medium text-base text-green-800">Localización encontrada</Text>
          </View>

          <View className="relative h-80 w-full overflow-hidden rounded-xl">
            <MapView
              style={{ flex: 1 }}
              loadingBackgroundColor="#bbf7d0"
              loadingIndicatorColor="#7ed321"
              mapType="satellite"
              showsCompass
              zoomControlEnabled
              showsScale
              showsMyLocationButton={false}
              initialRegion={{
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{ latitude: coordinates.lat, longitude: coordinates.lng }}
                anchor={{ x: 0.5, y: 0.5 }}
                draggable={isEditMode}
                onDragEnd={(e) => {
                  const newCoords = e.nativeEvent.coordinate
                  setCoordinates({
                    lat: newCoords.latitude,
                    lng: newCoords.longitude,
                  })
                }}
              >
                <View
                  className={twMerge(
                    "items-center justify-center rounded-full border-2 shadow-lg",
                    isEditMode ? "border-orange-500" : "border-green-500"
                  )}
                  style={{ width: 35, height: 35 }}
                >
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: 29,
                        height: 29,
                        borderRadius: 14.5,
                      }}
                      contentFit="cover"
                    />
                  )}
                </View>
              </Marker>
            </MapView>

            <TouchableOpacity
              onPress={() => {
                setIsEditMode(!isEditMode)
              }}
              className="absolute right-4 top-4 rounded-full bg-[#14141c] p-2 shadow-lg"
            >
              <HugeiconsIcon
                icon={isEditMode ? Tick01Icon : MapsEditingIcon}
                size={24}
                color="#7ed321"
                strokeWidth={isEditMode ? 1.5 : undefined}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="mx-2 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="self-start rounded-lg bg-yellow-100 p-1">
              <Text className="font-Inter-Medium text-base text-yellow-800">⚠️ No se encontraron coordenadas</Text>
            </View>
          </View>

          <PlaceSearch
            onLocationSelect={(coords) => {
              setUserCoordinates(coords)
            }}
          />

          <View className="relative h-80 w-full overflow-hidden rounded-xl">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              mapType="satellite"
              showsCompass
              showsScale
              zoomControlEnabled
              showsMyLocationButton={false}
              initialRegion={{
                latitude: 40.15513081892512,
                longitude: -4.139463936743206,
                latitudeDelta: 9,
                longitudeDelta: 9,
              }}
            >
              {userCoordinates &&
                (() => {
                  const { lat, lng } = userCoordinates
                  return (
                    <Marker
                      coordinate={{ latitude: lat, longitude: lng }}
                      anchor={{ x: 0.5, y: 0.5 }}
                      draggable={isEditMode}
                      onDragEnd={(e) => {
                        const newCoords = e.nativeEvent.coordinate
                        setUserCoordinates({
                          lat: newCoords.latitude,
                          lng: newCoords.longitude,
                        })
                      }}
                    >
                      <View
                        className="items-center justify-center rounded-full border-2 border-green-500 bg-white shadow-lg"
                        style={{ width: 35, height: 35 }}
                      >
                        {image && (
                          <Image
                            source={{ uri: image }}
                            style={{
                              width: 29,
                              height: 29,
                              borderRadius: 14.5,
                            }}
                            contentFit="cover"
                          />
                        )}
                      </View>
                    </Marker>
                  )
                })()}
            </MapView>

            <TouchableOpacity
              onPress={() => {
                setIsEditMode(!isEditMode)
              }}
              className="absolute right-4 top-4 rounded-full bg-[#14141c] p-2 shadow-lg"
            >
              <HugeiconsIcon
                icon={isEditMode ? Tick01Icon : MapsEditingIcon}
                size={24}
                color="#7ed321"
                strokeWidth={isEditMode ? 1.5 : undefined}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )

  const renderStep3 = () => (
    <View
      onLayout={onLayoutStep(2)}
      className="px-2 pt-2"
    >
      <View className="flex-row items-center justify-between">
        <View className="mx-2 flex-row items-center self-start rounded-lg bg-[#E1BAFF] p-1 pl-2">
          <Text className="font-Inter-Medium text-lg text-[#9000FF]">3º Completar Datos</Text>
          <LottieView
            source={require("@assets/animations/Edit.json")}
            autoPlay
            loop
            style={{ width: 34, height: 25 }}
          />
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={goToPrevStep}
            className="mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#fbd495] p-2"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={20}
              color="#7a5f00"
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextStep}
            className={`mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg p-2 ${currentStep === 2 ? "bg-gray-300 opacity-50" : "bg-[#95fb97]"}`}
            disabled={currentStep === 2}
          >
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color={currentStep === 2 ? "#6b7280" : "#0c4607"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Aquí el formulario para completar datos */}
      <View className="mx-2 mt-4 items-center justify-center py-8">
        <Text className="font-Inter-Medium text-lg text-gray-600">
          Aquí irá el formulario para completar los datos de la captura
        </Text>
      </View>
    </View>
  )

  const pickImage = async () => {
    setImage(null)
    setCoordinates(null)

    if (Platform.OS === "ios") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        exif: true,
        allowsEditing: false,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        setImage(asset.uri)

        const gps = await extractGPSFromImagePicker(asset)
        if (gps) {
          setCoordinates(gps)
        }
      }
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri)
        const gps = await extractGPSFromDocument(result.assets[0].uri)
        if (gps) {
          setCoordinates(gps)
        }
      }
    }
  }

  const carouselData = [
    { key: "step1", index: 0 },
    { key: "step2", index: 1 },
    { key: "step3", index: 2 },
  ]

  return (
    <Carousel
      ref={carouselRef}
      width={width}
      data={carouselData}
      scrollAnimationDuration={300}
      onSnapToItem={onStepChange}
      renderItem={({ item }) => {
        const stepComponents = [renderStep1(), renderStep2(), renderStep3()]
        return stepComponents[item.index] || <View />
      }}
      enabled={false}
      loop={false}
      autoPlay={false}
      pagingEnabled={false}
      snapEnabled={false}
      style={[{ overflow: "hidden" }, animatedStyle]}
    />
  )
}
