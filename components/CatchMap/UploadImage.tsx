import "react-native-get-random-values"
import React, { useEffect, useRef, useMemo, useCallback, useReducer } from "react"
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
import { inicialStateImageReducer, uploadImageReducer } from "hooks/useUploadImage"

const { width } = Dimensions.get("window")
const MAX_IMAGES = 3
const ANIMATION_DURATION = 300

interface StepData {
  key: string
  index: number
}

export default function UploadImage() {
  const [state, dispatch] = useReducer(uploadImageReducer, inicialStateImageReducer)
  const {
    embalse,
    images,
    isSending,
    isSuccess,
    isError,
    coordinates,
    userCoordinates,
    imageDate,
    currentStep,
    isEditMode,
    heights,
  } = state

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
    dispatch({ type: "setCoordinates", payload: null })
    dispatch({ type: "setImageDate", payload: null })
  }, [])

  const resetAllData = useCallback(() => {
    dispatch({ type: "setImages", payload: [] })
    resetImageData()
  }, [resetImageData])

  const handlePickImage = useCallback(async () => {
    const setImages = (value: string[]) => dispatch({ type: "setImages", payload: value })
    const setCoordinates = (value: GPSCoordinates) => dispatch({ type: "setCoordinates", payload: value })
    const setImageDate = (value: string | null | ((prevState: string | null) => string | null)) => {
      if (typeof value === "function") {
        dispatch({ type: "setImageDate", payload: value(imageDate) })
      } else {
        dispatch({ type: "setImageDate", payload: value })
      }
    }
    await pickImage({
      images,
      MAX_IMAGES,
      resetImageData,
      setImages,
      setCoordinates,
      setImageDate,
    })
  }, [images, resetImageData, imageDate])

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "setCurrentStep", payload: step })
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
      dispatch({ type: "setHeights", payload: heights.map((height, i) => (i === index ? h : height)) })
    },
    [heights]
  )

  const onStepChange = useCallback((index: number) => {
    dispatch({ type: "setCurrentStep", payload: index })
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
        onToggleEdit={() => dispatch({ type: "setIsEditMode", payload: !isEditMode })}
        onDragEnd={(value) => dispatch({ type: "setCoordinates", payload: value })}
        onLocationSelect={(value) => dispatch({ type: "setUserCoordinates", payload: value })}
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
        setImageDate={(value) => dispatch({ type: "setImageDate", payload: value })}
        onInputFocus={scrollToInput}
        images={images}
        setIsSending={(value) => dispatch({ type: "setIsSending", payload: value })}
        setIsSuccess={(value) => dispatch({ type: "setIsSuccess", payload: value })}
        setIsError={(value) => dispatch({ type: "setIsError", payload: value })}
        setEmbalse={(value: string | null) => dispatch({ type: "setEmbalse", payload: value ?? "" })}
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
