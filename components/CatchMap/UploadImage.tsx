import "react-native-get-random-values"
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { View, Dimensions } from "react-native"
import MapView from "react-native-maps"
import { type GPSCoordinates } from "lib/extractGPSCoordinates"
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"
import { type CatchReportRef } from "components/UploadCatch/CatchReport"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useHistoricalDataCatch, useHistoricalWeather } from "querys"
import Step1SelectImages from "./Step1SelectImages"
import Step2VerifyLocation from "./Step2VerifyLocation"
import Step3CompleteData from "./Step3CompleteData"
import Step4HistoricalData from "./Step4HistoricalData"
import Step5UploadStatus from "./Step5UploadStatus"
import { pickImage } from "./PickImage"

const { width } = Dimensions.get("window")
const MAX_IMAGES = 3
const ANIMATION_DURATION = 300

interface StepData {
  key: string
  index: number
}

export default function UploadImage() {
  const [embalse, setEmbalse] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState<GPSCoordinates | null>(null)
  const [userCoordinates, setUserCoordinates] = useState<GPSCoordinates | null>(null)
  const [imageDate, setImageDate] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [heights, setHeights] = useState<number[]>([0, 0, 0, 0, 0])
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const mapRef = useRef<MapView>(null)
  const carouselRef = useRef<any>(null)
  const catchReportRef = useRef<CatchReportRef>(null)
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null)
  const heightAnim = useSharedValue<number>(0)

  const activeCoordinates = useMemo(() => coordinates || userCoordinates, [coordinates, userCoordinates])
  const memoizedDate = useMemo(() => (imageDate ? new Date(imageDate) : new Date()), [imageDate])

  const { data, isLoading } = useHistoricalDataCatch(embalse || "", currentStep)
  useHistoricalWeather(activeCoordinates?.lat ?? null, activeCoordinates?.lng ?? null, memoizedDate)

  useEffect(() => {
    if (heights[currentStep]) {
      heightAnim.value = withTiming(heights[currentStep], { duration: 200 })
    }
  }, [currentStep, heights, heightAnim])

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

  const resetImageData = useCallback(() => {
    setCoordinates(null)
    setImageDate(null)
  }, [])

  const resetAllData = useCallback(() => {
    setImages([])
    resetImageData()
  }, [resetImageData])

  const handlePickImage = useCallback(async () => {
    await pickImage({
      images,
      MAX_IMAGES,
      resetImageData,
      setImages,
      setCoordinates,
      setImageDate,
    })
  }, [images, resetImageData])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
    carouselRef.current?.scrollTo({ index: step, animated: true })
  }, [])

  const goToNextStep = useCallback(() => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1

      if (currentStep === 3 && nextStep === 4) {
        const hasCoordinates = coordinates || userCoordinates
        const hasImages = images.length > 0
        const hasEmbalse = embalse

        if (!hasCoordinates || !hasImages || !hasEmbalse) {
          console.warn("No se puede enviar el reporte: faltan datos necesarios")
          return
        }

        if (catchReportRef.current) {
          catchReportRef.current.submitForm()
        }
      }

      goToStep(nextStep)
    }
  }, [currentStep, coordinates, userCoordinates, images.length, embalse, goToStep])

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const scrollToInput = useCallback((reactNode: any) => {
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollToFocusedInput(reactNode)
    }
  }, [])

  const onLayoutStep = useCallback(
    (index: number) => (event: any) => {
      const h = event.nativeEvent.layout.height
      setHeights((prev) => {
        if (prev[index] === h) return prev
        const newHeights = [...prev]
        newHeights[index] = h
        return newHeights
      })
    },
    []
  )

  const onStepChange = useCallback((index: number) => {
    setCurrentStep(index)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }))

  const onKeyboardWillShow = useCallback((frames: any) => {
    // Keyboard will show
  }, [])

  const onKeyboardWillHide = useCallback((frames: any) => {
    // Keyboard will hide
  }, [])

  const renderStep1 = useCallback(
    () => (
      <Step1SelectImages
        images={images}
        onPickImage={handlePickImage}
        onChangeSelection={resetAllData}
        onNext={images.length > 0 ? goToNextStep : undefined}
        canNext={images.length > 0}
        onLayout={onLayoutStep(0)}
        maxImages={MAX_IMAGES}
      />
    ),
    [images, goToNextStep, handlePickImage, resetAllData, onLayoutStep]
  )

  const renderStep2 = useCallback(
    () => (
      <Step2VerifyLocation
        coordinates={coordinates}
        userCoordinates={userCoordinates}
        images={images}
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onDragEnd={setCoordinates}
        onLocationSelect={setUserCoordinates}
        onInputFocus={scrollToInput}
        onPrev={goToPrevStep}
        onNext={goToNextStep}
        onLayout={onLayoutStep(1)}
        mapRef={mapRef}
      />
    ),
    [coordinates, userCoordinates, images, isEditMode, goToPrevStep, goToNextStep, scrollToInput, onLayoutStep]
  )

  const renderStep3 = useCallback(
    () => (
      <Step3CompleteData
        imageDate={imageDate}
        setImageDate={setImageDate}
        onInputFocus={scrollToInput}
        images={images}
        setIsSending={setIsSending}
        setIsSuccess={setIsSuccess}
        setIsError={setIsError}
        setEmbalse={setEmbalse}
        embalseData={data && Array.isArray(data) && data.length > 0 ? data[0] : null}
        coordinates={coordinates || userCoordinates}
        onPrev={goToPrevStep}
        onNext={goToNextStep}
        onLayout={onLayoutStep(2)}
        catchReportRef={catchReportRef}
      />
    ),
    [imageDate, scrollToInput, images, data, coordinates, userCoordinates, goToPrevStep, goToNextStep, onLayoutStep]
  )

  const renderStep4 = useCallback(() => {
    const canProceed = Boolean((coordinates || userCoordinates) && images.length > 0 && embalse)

    return (
      <Step4HistoricalData
        coordinates={coordinates}
        userCoordinates={userCoordinates}
        images={images}
        embalse={embalse}
        data={data}
        imageDate={imageDate}
        isLoading={isLoading}
        onPrev={goToPrevStep}
        onNext={canProceed ? goToNextStep : undefined}
        canNext={canProceed}
        onLayout={onLayoutStep(3)}
      />
    )
  }, [
    coordinates,
    userCoordinates,
    images,
    embalse,
    data,
    imageDate,
    isLoading,
    goToPrevStep,
    goToNextStep,
    onLayoutStep,
  ])

  const renderStep5 = useCallback(
    () => (
      <Step5UploadStatus
        isSending={isSending}
        isSuccess={isSuccess}
        isError={isError}
        onLayout={onLayoutStep(4)}
      />
    ),
    [isSending, isSuccess, isError, onLayoutStep]
  )

  const carouselData: StepData[] = [
    { key: "step1", index: 0 },
    { key: "step2", index: 1 },
    { key: "step3", index: 2 },
    { key: "step4", index: 3 },
    { key: "step5", index: 4 },
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
        scrollAnimationDuration={ANIMATION_DURATION}
        onSnapToItem={onStepChange}
        renderItem={({ item }) => {
          const stepComponents = [renderStep1(), renderStep2(), renderStep3(), renderStep4(), renderStep5()]
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
