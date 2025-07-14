import { View, Text, TouchableOpacity, Alert, Platform, TextInput, ActivityIndicator } from "react-native"
import { useEffect, useRef, useState } from "react"
import {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { useForm } from "@tanstack/react-form"
import { UserData } from "types/index"
import { Image } from "expo-image"
import { pickImage } from "lib/pickImage"
import { emailVerification, supabase } from "lib/supabase"
import { uploadImage } from "lib/uploadImage"
import { useQueryClient } from "@tanstack/react-query"
import { useStore } from "store"
import { EyeIcon, ViewOffIcon, LockPasswordIcon, EditUser02Icon, UserIcon } from "@hugeicons/core-free-icons"

export default function EditProfileBottomSheet({
  setOpen,
  open,
  userData,
}: {
  setOpen: (open: boolean) => void
  open?: boolean
  userData: UserData
}) {
  const queryClient = useQueryClient()
  const btsPref = useRef<BottomSheetModal>(null)

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      enableTouchThrough={false}
      pressBehavior="close"
    />
  )

  const CustomBackground = ({ style }: BottomSheetBackgroundProps) => (
    <View
      className="flex-1 rounded-t-[20px]"
      style={[
        {
          backgroundColor: "#14141c",
        },
        style,
      ]}
    />
  )

  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [pwVisible, setPwVisible] = useState(false)

  const showErrorAlert = (message: string) => {
    Alert.alert("Error", message, [{ text: "Entendido", style: "cancel" }], { cancelable: true })
  }

  const showSuccessAlert = (message: string, onConfirm?: () => void) => {
    Alert.alert(
      "Completado",
      message,
      [
        {
          text: "Continuar",
          style: "default",
          onPress: () => {
            setTimeout(() => {
              setOpen(false)
              resetForm()
              onConfirm?.()
            }, 300)
          },
        },
      ],
      { cancelable: true }
    )
  }

  const form = useForm({
    defaultValues: {
      nombre: userData.name || "",
      apellidos: userData.lastname,
      email: userData.email,
      password: "",
      avatar: userData.avatar || "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true)

        const emailChanged = value.email !== userData.email
        const passwordChanged = value.password.trim() !== ""

        if (emailChanged) {
          const emailVerify = await emailVerification(value.email)
          if (emailVerify) {
            Alert.alert(
              "Correo ya registrado",
              "El correo electrónico que has ingresado ya está en uso. Intenta con otro.",
              [{ text: "Entendido", style: "cancel" }],
              { cancelable: true }
            )
            setIsLoading(false)
            return
          }
        }

        const updateData: any = {
          data: {
            name: value.nombre,
            lastName: value.apellidos,
          },
        }

        if (emailChanged) {
          updateData.email = value.email
        }

        if (passwordChanged) {
          updateData.password = value.password
        }

        const { error } = await supabase.auth.updateUser(updateData)

        if (error) {
          console.error("Error updating auth user:", error)
          showErrorAlert(`Error actualizando usuario: ${error.message}`)
          setIsLoading(false)
          return
        }

        let avatarUrl = value.avatar

        if (imageBase64) {
          const uploadResponse = await uploadImage({
            imageBase64: imageBase64,
            userId: userData.id,
            bucketName: "accounts",
            fileName: "Avatar",
            fileExtension: "png",
          })

          if (uploadResponse.error) {
            console.error("Error uploading image:", uploadResponse.error)
            showErrorAlert(`Error subiendo imagen: ${uploadResponse.error}`)
            setIsLoading(false)
            return
          }

          if (uploadResponse.data?.imageUrl) {
            avatarUrl = uploadResponse.data.imageUrl
          }
        }

        const profileUpdateData: any = {
          name: value.nombre,
          lastname: value.apellidos,
          avatar: avatarUrl,
        }

        if (!emailChanged) {
          profileUpdateData.email = value.email
        }

        const { error: profileError } = await supabase.from("profiles").update(profileUpdateData).eq("id", userData.id)

        if (profileError) {
          console.error("Error updating profile:", profileError)
          showErrorAlert(`Error actualizando perfil: ${profileError.message}`)
          setIsLoading(false)
          return
        }

        queryClient.invalidateQueries({ queryKey: ["accountData", userData.id] })

        if (emailChanged) {
          showSuccessAlert(
            "Te enviamos un email de confirmación. El correo se actualizará solo si confirmas desde el nuevo."
          )
          const setNewEmail = useStore.getState().setNewEmail
          setNewEmail(value.email)
        } else {
          showSuccessAlert("Perfil actualizado correctamente")
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        showErrorAlert("Ocurrió un error inesperado")
      } finally {
        setIsLoading(false)
      }
    },
  })

  useEffect(() => {
    if (open) {
      btsPref.current?.present()
    } else {
      btsPref.current?.dismiss()
    }
  }, [open])

  const resetForm = () => {
    form.reset()
    setImage(null)
    setImageBase64(null)
  }

  const handlePickImage = () => {
    pickImage({
      setError: (error) => {
        if (typeof error === "string" && error) {
          showErrorAlert(error)
        }
      },
      setImage,
      setImageBase64,
    })
  }

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ backgroundColor: "#064e3b" }}
      ref={btsPref}
      enableDynamicSizing
      enableDismissOnClose
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backgroundComponent={(props) => <CustomBackground {...props} />}
      onDismiss={() => {
        setOpen(false)
        resetForm()
      }}
    >
      <BottomSheetView className="h-auto px-4 pb-6">
        <View className="flex-row items-center justify-center gap-2 self-center px-3 py-1">
          <HugeiconsIcon
            icon={EditUser02Icon}
            size={24}
            color="#a7f3d0"
            strokeWidth={1.5}
          />
          <Text className="font-Inter-Medium text-lg text-emerald-200">Editar Perfil</Text>
        </View>

        <form.Field name="nombre">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-lg text-emerald-300">Nombre</Text>
              </View>
              <View className="mt-3 flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={24}
                  color="#047857"
                  strokeWidth={1.5}
                />
                <TextInput
                  style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                  className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                  aria-label="input"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="done"
                  textAlignVertical="center"
                  autoComplete="off"
                  placeholder="Nombre"
                  placeholderTextColor="#047857"
                />
              </View>
            </View>
          )}
        </form.Field>

        <form.Field name="apellidos">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-lg text-emerald-300">Apellidos</Text>
              </View>
              <View className="mt-3 flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={24}
                  color="#047857"
                  strokeWidth={1.5}
                />
                <TextInput
                  style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                  className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                  aria-label="input"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="done"
                  textAlignVertical="center"
                  autoComplete="off"
                  placeholder="Apellidos"
                  placeholderTextColor="#047857"
                />
              </View>
            </View>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-lg text-emerald-300">Email</Text>
              </View>
              <View className="mt-3 flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={24}
                  color="#047857"
                  strokeWidth={1.5}
                />
                <BottomSheetTextInput
                  style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                  className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                  aria-label="input"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="done"
                  textAlignVertical="center"
                  autoComplete="off"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor="#047857"
                />
              </View>
            </View>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-lg text-emerald-300">Cambiar contraseña</Text>
              </View>
              <View className="mt-3 flex-row items-center gap-2 rounded-full bg-green-100 px-2">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={24}
                  color="#047857"
                  strokeWidth={1.5}
                />
                <BottomSheetTextInput
                  style={{ lineHeight: Platform.OS === "ios" ? 0 : undefined }}
                  className="h-12 flex-1 font-Inter-Medium text-base text-emerald-900"
                  aria-label="input"
                  aria-labelledby="labelPassword"
                  secureTextEntry={!pwVisible}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="done"
                  textAlignVertical="center"
                  autoComplete="off"
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#047857"
                />
                <TouchableOpacity
                  onPress={() => setPwVisible(!pwVisible)}
                  className="ml-2"
                >
                  <HugeiconsIcon
                    icon={pwVisible ? ViewOffIcon : EyeIcon}
                    size={24}
                    color="#047857"
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </form.Field>

        <form.Field name="avatar">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-lg text-emerald-300">Imagen de perfil</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickImage}
                className="mt-3 h-24 w-24 self-start overflow-hidden rounded-full border-2 border-emerald-800"
              >
                <Image
                  source={{
                    uri:
                      image ||
                      field.state.value ||
                      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 9999 }}
                  cachePolicy={"none"}
                />
              </TouchableOpacity>
            </View>
          )}
        </form.Field>

        <TouchableOpacity
          className={`mb-6 mt-6 w-full items-center justify-center rounded-2xl ${isLoading ? "bg-emerald-400" : "bg-emerald-600"} px-6 py-3`}
          onPress={() => form.handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator
                size={"small"}
                color={"white"}
              />
              <Text className="font-Inter-SemiBold text-lg text-white">Guardando...</Text>
            </View>
          ) : (
            <Text className="font-Inter-SemiBold text-lg text-white">Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  )
}
