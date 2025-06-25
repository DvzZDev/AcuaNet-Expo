import { View, Text, TouchableOpacity, Platform, TextInput, findNodeHandle } from "react-native"
import { useForm } from "@tanstack/react-form"
import PlaceSearchForm from "./PlaceSearchForm"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Cancel01Icon, Edit03Icon, TickIcon } from "@hugeicons/core-free-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState, useImperativeHandle, forwardRef } from "react"
import DropDownEspecie from "./DropDownEspecie"
import DropDownTecnica from "./DropDownTecnica"
import DropDownSituacion from "./DropDownSituacion"
import { ScrollView } from "react-native-gesture-handler"
import DropDownProfundidad from "./DropDownProfundidad"
import Animated, { FadeInUp, FadeOutUp, SequencedTransition } from "react-native-reanimated"

export interface CatchReportRef {
  submitForm: () => void
  canSubmit: () => boolean
}

interface CatchReportProps {
  date?: string
  setDate?: (date: string) => void
  onInputFocus?: (reactNode: any) => void
}

const CatchReport = forwardRef<CatchReportRef, CatchReportProps>(({ date, setDate, onInputFocus }, ref) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [especieSelector, setEspecieSelector] = useState(false)
  const [tecnicaSelector, setTecnicaSelector] = useState(false)
  const [situacion, setSituacion] = useState(false)
  const [profundidad, setProfundidad] = useState(false)

  const IDate = selectedDate.toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const form = useForm({
    defaultValues: {
      embalse: "",
      date: "",
      especie: "",
      tecnica: "",
      situacion: "",
      profundidad: "",
      temperatura: "",
      comentarios: "",
    },
    onSubmit: (values) => {
      console.log("Form submitted with values:", values)
    },
  })

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      console.log("submitForm called from ref")
      console.log("Form state:", form.state)
      form.handleSubmit()
      console.log("Form submitted")
    },
    canSubmit: () => {
      return form.state.canSubmit
    },
  }))

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false)
      if (event?.type !== "dismissed" && date) {
        setSelectedDate(date)
        setShowTimePicker(true)
      }
    } else {
      if (date) {
        setSelectedDate(date)
        form.setFieldValue("date", date.toISOString())
        setDate?.(date.toISOString())
      }
    }
  }

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false)
    if (event?.type !== "dismissed" && time) {
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(time.getHours())
      newDateTime.setMinutes(time.getMinutes())

      setSelectedDate(newDateTime)
      form.setFieldValue("date", newDateTime.toISOString())
      setDate?.(newDateTime.toISOString())
    }
  }

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  return (
    <ScrollView className="m-3 h-[40rem]">
      <Animated.View
        layout={SequencedTransition}
        className="gap-3"
      >
        {/* Embalse */}
        <form.Field
          name="embalse"
          validators={{
            onChange: ({ value }) => (value ? undefined : "La capa de agua es obligatoria"),
          }}
        >
          {(field) => (
            <View>
              <View className="flex-row items-center gap-2">
                <Text className="font-Inter-SemiBold text-lg text-green-950">
                  Embalse o capa de agua <Text className="text-xs text-red-500">*</Text>
                </Text>
                {field.state.meta.errors.length > 0 && (
                  <Text className="rounded-lg bg-yellow-100 p-1 text-xs text-red-500">
                    {field.state.meta.errors[0]}
                  </Text>
                )}
              </View>
              <PlaceSearchForm
                onLocationSelect={(Embalse) => field.setValue(Embalse)}
                onInputFocus={onInputFocus}
              />
            </View>
          )}
        </form.Field>

        {/* Fecha */}
        <form.Field
          name="date"
          validators={{
            onChange: ({ value }) => (value ? undefined : "La fecha es obligatoria"),
          }}
        >
          {(field) => (
            <>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="font-Inter-SemiBold text-lg text-green-950">
                    Fecha de la captura <Text className="text-xs text-red-500">*</Text>
                  </Text>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="rounded-lg bg-yellow-100 p-1 text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-2">
                  <Text className="font-Inter-Medium text-base">{IDate}</Text>
                  <View className="flex-row items-center gap-2">
                    {showDatePicker && Platform.OS === "ios" && (
                      <TouchableOpacity
                        className="items-center justify-center rounded-xl border border-lime-500 bg-lime-300 p-2"
                        onPress={() => setShowDatePicker(false)}
                      >
                        <HugeiconsIcon
                          icon={TickIcon}
                          size={18}
                          color="#3f6212"
                          strokeWidth={1.5}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      className="items-center justify-center rounded-xl border border-lime-500 bg-lime-300 p-2"
                      onPress={openDatePicker}
                    >
                      <HugeiconsIcon
                        icon={Edit03Icon}
                        size={18}
                        color="#3f6212"
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {showDatePicker && (
                <Animated.View
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                >
                  <DateTimePicker
                    value={selectedDate}
                    mode={Platform.OS === "android" ? "date" : "datetime"}
                    display={Platform.OS === "ios" ? "compact" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                </Animated.View>
              )}
              {showTimePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={selectedDate}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </>
          )}
        </form.Field>

        {/* Especio */}
        <form.Field
          name="especie"
          validators={{
            onChange: ({ value }) => (value ? undefined : "La especie es obligatoria"),
          }}
        >
          {(field) => (
            <>
              <View className="relative gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="font-Inter-SemiBold text-lg text-green-950">
                    Especie <Text className="text-xs text-red-500">*</Text>
                  </Text>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="rounded-lg bg-yellow-100 p-1 text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setEspecieSelector(!especieSelector)}
                  className="relative flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-3"
                >
                  <Text
                    className={`font-Inter-Medium text-base ${field.state.value ? "text-[#052e16]" : "text-[#71947d]"}`}
                  >
                    {field.state.value ? field.state.value : "Selecciona una especie"}
                  </Text>

                  {field.state.value && (
                    <TouchableOpacity
                      onPress={() => field.setValue("")}
                      className="absolute right-3 rounded-lg border border-lime-500 bg-lime-300 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        color="#3f6212"
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <DropDownEspecie
                  setEspecieSelector={setEspecieSelector}
                  especieSelector={especieSelector}
                  setSpecies={field.setValue}
                />
              </View>
            </>
          )}
        </form.Field>

        {/* Técnica */}
        <form.Field name="tecnica">
          {(field) => (
            <>
              <View className="relative gap-2">
                <Text className="font-Inter-SemiBold text-lg text-green-950">Técnica</Text>
                <TouchableOpacity
                  onPress={() => setTecnicaSelector(!tecnicaSelector)}
                  className="relative flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-3"
                >
                  <Text
                    className={`font-Inter-Medium text-base ${field.state.value ? "text-[#052e16]" : "text-[#71947d]"}`}
                  >
                    {field.state.value ? field.state.value : "Selecciona una técnica"}
                  </Text>

                  {field.state.value && (
                    <TouchableOpacity
                      onPress={() => field.setValue("")}
                      className="absolute right-3 rounded-lg border border-lime-500 bg-lime-300 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        color="#3f6212"
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <DropDownTecnica
                  setTecnicaSelector={setTecnicaSelector}
                  tecnicaSelector={tecnicaSelector}
                  setTecnica={field.setValue}
                />
              </View>
            </>
          )}
        </form.Field>

        {/* Situación */}
        <form.Field
          name="situacion"
          validators={{
            onChange: ({ value }) => (value ? undefined : "La situación es obligatoria"),
          }}
        >
          {(field) => (
            <>
              <View className="relative gap-2">
                <Text className="font-Inter-SemiBold text-lg text-green-950">Situación</Text>
                <TouchableOpacity
                  onPress={() => setSituacion(!situacion)}
                  className="relative flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-3"
                >
                  <Text
                    className={`font-Inter-Medium text-base ${field.state.value ? "text-[#052e16]" : "text-[#71947d]"}`}
                  >
                    {field.state.value ? field.state.value : "Selecciona una situacion"}
                  </Text>
                  {field.state.value && (
                    <TouchableOpacity
                      onPress={() => field.setValue("")}
                      className="absolute right-3 rounded-lg border border-lime-500 bg-lime-300 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        color="#3f6212"
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <DropDownSituacion
                  setSituacionSelector={setSituacion}
                  situacionSelector={situacion}
                  setSituacion={field.setValue}
                />
              </View>
            </>
          )}
        </form.Field>

        {/* Temperatura */}
        <form.Field
          name="temperatura"
          validators={{
            onChange: ({ value }) => (/^[0-9]*$/.test(value) ? undefined : "Solo se permiten números"),
          }}
        >
          {(field) => (
            <>
              <View className="relative gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="font-Inter-SemiBold text-lg text-green-950">Temperatura del agua</Text>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="rounded-lg bg-yellow-100 p-1 text-xs text-red-500">
                      {field.state.meta.errors[0]}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-3">
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.setValue}
                    onFocus={(event) => {
                      if (onInputFocus) {
                        // @ts-ignore - findNodeHandle funciona con event.target
                        onInputFocus(findNodeHandle(event.target))
                      }
                    }}
                    placeholder="0"
                    placeholderTextColor="#71947d"
                    keyboardType="numeric"
                    className="ios:leading-[0] flex-1 pr-2 font-Inter-Medium text-base text-green-950"
                  />
                  <Text className="font-Inter-Medium text-base text-green-950">°C</Text>
                </View>
              </View>
            </>
          )}
        </form.Field>

        {/* Profundidad */}
        <form.Field name="profundidad">
          {(field) => (
            <>
              <View className="relative gap-2">
                <Text className="font-Inter-SemiBold text-lg text-green-950">Profundidad (m)</Text>
                <TouchableOpacity
                  onPress={() => setProfundidad(!profundidad)}
                  className="relative flex-row items-center justify-between rounded-lg border border-green-300 bg-green-200 px-3 py-3"
                >
                  <Text
                    className={`font-Inter-Medium text-base ${field.state.value ? "text-[#052e16]" : "text-[#71947d]"}`}
                  >
                    {field.state.value ? field.state.value : "Selecciona una profundidad"}
                  </Text>
                  {field.state.value && (
                    <TouchableOpacity
                      onPress={() => field.setValue("")}
                      className="absolute right-3 rounded-lg border border-lime-500 bg-lime-300 p-1"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        color="#3f6212"
                        strokeWidth={1.5}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <DropDownProfundidad
                  setProfundidadSelector={setProfundidad}
                  profundidadSelector={profundidad}
                  setProfundidad={field.setValue}
                />
              </View>
            </>
          )}
        </form.Field>

        {/* Comentarios */}
        <form.Field
          name="comentarios"
          validators={{
            onChange: ({ value }) => (value.length > 200 ? "El comentario es demasiado largo" : undefined),
          }}
        >
          {(field) => (
            <View className="relative gap-2">
              <Text className="font-Inter-SemiBold text-lg text-green-950">Comentarios</Text>
              <View className="relative rounded-xl border border-green-300 bg-green-200 px-3">
                <View>
                  <TextInput
                    placeholder="Comentarios adicionales"
                    value={field.state.value}
                    onChangeText={field.setValue}
                    onFocus={(event) => {
                      if (onInputFocus) {
                        // @ts-ignore - findNodeHandle funciona con event.target
                        onInputFocus(findNodeHandle(event.target))
                      }
                    }}
                    placeholderTextColor={"#71947d"}
                    multiline
                    scrollEnabled={false}
                    textAlignVertical="top"
                    className="font-Inter-Regular min-h-[120px] text-base text-green-950"
                  />
                </View>
                <View className="absolute bottom-2 right-3 flex-row items-center gap-1 rounded-lg border border-lime-500 bg-lime-300 p-1">
                  <Text className="text-xs text-[#3f6212]">{field.state.value.length} / 200</Text>
                </View>
              </View>
            </View>
          )}
        </form.Field>
      </Animated.View>
    </ScrollView>
  )
})

export default CatchReport
