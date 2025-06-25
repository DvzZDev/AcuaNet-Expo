/* eslint-disable react-hooks/exhaustive-deps */
import "react-native-get-random-values"
import React, { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, Text, Platform, Dimensions } from "react-native"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ExchangeIcon,
  Image01FreeIcons,
  ImageUploadIcon,
  InformationCircleIcon,
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
import CatchReport, { type CatchReportRef } from "components/UploadCatch/CatchReport"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

const { width } = Dimensions.get("window")

export default function UploadImage() {
  const [images, setImages] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState<GPSCoordinates | null>(null)
  const [userCoordinates, setUserCoordinates] = useState<GPSCoordinates | null>(null)
  const [imageDate, setImageDate] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const mapRef = useRef<MapView>(null)
  const carouselRef = useRef<any>(null)
  const catchReportRef = useRef<CatchReportRef>(null)
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)
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

  const pickImage = async () => {
    if (images.length >= 3) {
      return
    }

    setCoordinates(null)
    setImageDate(null)

    if (Platform.OS === "ios") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) return

      const remainingSlots = 3 - images.length

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        exif: true,
        allowsEditing: false,
        selectionLimit: remainingSlots,
        allowsMultipleSelection: true,
      })

      if (!result.canceled && result.assets) {
        const assetsToAdd = result.assets.slice(0, remainingSlots)
        const newImageUris = assetsToAdd.map((asset) => asset.uri)

        setImages((prev) => [...(prev || []), ...newImageUris])

        if (assetsToAdd[0]) {
          const gpsData = await extractGPSFromImagePicker(assetsToAdd[0])
          if (gpsData) {
            setCoordinates({
              lat: gpsData.lat,
              lng: gpsData.lng,
            })
            setImageDate(gpsData.date || null)
          }
        }
      }
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
        multiple: true,
      })

      if (!result.canceled && result.assets) {
        const remainingSlots = 3 - images.length
        const assetsToAdd = result.assets.slice(0, remainingSlots)
        const newImageUris = assetsToAdd.map((asset) => asset.uri)

        setImages((prev) => [...(prev || []), ...newImageUris])

        if (assetsToAdd[0]) {
          const gpsData = await extractGPSFromDocument(assetsToAdd[0].uri)
          if (gpsData) {
            setCoordinates({
              lat: gpsData.lat,
              lng: gpsData.lng,
            })
            setImageDate(gpsData.date || null)
          }
        }
      }
    }
  }

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

  const scrollToInput = (reactNode: any) => {
    if (scrollViewRef.current) {
      // @ts-ignore - scrollToFocusedInput existe en el ref del componente
      scrollViewRef.current.scrollToFocusedInput(reactNode)
    }
  }

  const onKeyboardWillShow = (frames: any) => {
    console.log("Keyboard will show", frames)
  }

  const onKeyboardWillHide = (frames: any) => {
    console.log("Keyboard will hide", frames)
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
        <View className="ml-2 flex-row items-center self-start rounded-lg bg-[#95d6fb] p-1 px-2">
          <Text className="font-Inter-Medium text-lg text-[#126ca1]">1º Selecionar Imágenes</Text>
          <LottieView
            source={require("@assets/animations/Upload.json")}
            autoPlay
            loop
            style={{ width: 34, height: 25 }}
          />
        </View>
        <TouchableOpacity
          onPress={goToNextStep}
          className={`mx-2 mb-3 flex-row items-center gap-1 self-start rounded-lg bg-[#95fb97] p-2 ${images.length === 0 ? "opacity-50" : "opacity-100"}`}
          disabled={images.length === 0}
        >
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            color={images.length > 0 ? "#0c4607" : "#6b7280"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {images.length > 0 ? (
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
                      className=" w-[20%] overflow-hidden rounded-lg"
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
              <Text className="font-Inter-Medium text-xs text-[#9affa1]">{images.length}/3</Text>
            </View>

            {images.length < 3 && (
              <TouchableOpacity
                onPress={pickImage}
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
            onPress={() => {
              setImages([])
              setCoordinates(null)
              setImageDate(null)
            }}
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
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="relative mx-2 h-[30vh] items-center justify-center rounded-2xl bg-emerald-900 px-8"
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
            <Text className="font-Inter-Medium text-xs text-[#9affa1]">0/3</Text>
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
              Puedes subir un máximo de 3 imágenes.
            </Text>
          </View>
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
                  {images[0] && (
                    <Image
                      source={{ uri: images[0] }}
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
            onInputFocus={scrollToInput}
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
                        {images[0] && (
                          <Image
                            source={{ uri: images[0] }}
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
            onPress={() => {
              if (catchReportRef.current) {
                catchReportRef.current.submitForm()
              }
            }}
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

      <CatchReport
        ref={catchReportRef}
        date={imageDate ? imageDate : undefined}
        setDate={setImageDate}
        onInputFocus={scrollToInput}
      />
    </View>
  )

  const carouselData = [
    { key: "step1", index: 0 },
    { key: "step2", index: 1 },
    { key: "step3", index: 2 },
  ]

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      enableAutomaticScroll
      enableOnAndroid
      onKeyboardWillShow={onKeyboardWillShow}
      onKeyboardWillHide={onKeyboardWillHide}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
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
    </KeyboardAwareScrollView>
  )
}
