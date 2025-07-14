import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useEffect, useRef, useState } from "react"
import {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { EditUser02Icon } from "@hugeicons/core-free-icons"
import { useForm } from "@tanstack/react-form"
import { UserData } from "types/index"
import { Image } from "expo-image"
import { pickImage } from "lib/pickImage"
import { emailVerification, supabase } from "lib/supabase"
import { uploadImage } from "lib/uploadImage"
import { useQueryClient } from "@tanstack/react-query"
import { useStore } from "store"

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
          backgroundColor: "#defce2",
        },
        style,
      ]}
    />
  )

  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  const showErrorAlert = (message: string) => {
    Alert.alert("Error", message, [{ text: "Entendido", style: "cancel" }], { cancelable: true })
  }

  const showSuccessAlert = (message: string, onConfirm?: () => void) => {
    Alert.alert(
      "Éxito",
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
      setError: (error) => showErrorAlert(error ?? "Ocurrió un error"),
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
        <View className="flex-row items-center justify-center gap-1 self-start rounded-xl border border-emerald-800 bg-emerald-200 p-2">
          <HugeiconsIcon
            icon={EditUser02Icon}
            size={24}
            color="#064e3b"
            strokeWidth={1.5}
          />
          <Text>Editar Perfil</Text>
        </View>

        <form.Field name="nombre">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-xl text-emerald-950">Nombre</Text>
              </View>
              <BottomSheetTextInput
                className="font-Inter-Regular mt-2 w-full rounded-lg border border-emerald-800 bg-green-100 px-3 py-2 text-base text-emerald-900"
                value={field.state.value}
                onChangeText={field.handleChange}
                style={{ fontFamily: "Inter-Regular" }}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="apellidos">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-xl text-emerald-950">Apellidos</Text>
              </View>
              <BottomSheetTextInput
                className="mt-2 w-full rounded-lg border border-emerald-800 bg-green-100 px-3 py-2 text-base text-emerald-900"
                value={field.state.value}
                onChangeText={field.handleChange}
                style={{ fontFamily: "Inter-Regular" }}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-xl text-emerald-950">Email</Text>
              </View>
              <BottomSheetTextInput
                className="mt-2 w-full rounded-lg border border-emerald-800 bg-green-100 px-3 py-2 text-base text-emerald-900"
                value={field.state.value}
                onChangeText={field.handleChange}
                keyboardType="email-address"
                style={{ fontFamily: "Inter-Regular" }}
              />
            </View>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-xl text-emerald-950">Cambiar contraseña</Text>
              </View>
              <BottomSheetTextInput
                className="mt-2 w-full rounded-lg border border-emerald-800 bg-green-100 px-3 py-2 text-base text-emerald-900"
                value={field.state.value}
                onChangeText={field.handleChange}
                style={{ fontFamily: "Inter-Regular" }}
                placeholder="Nueva contraseña"
                secureTextEntry
              />
            </View>
          )}
        </form.Field>

        <form.Field name="avatar">
          {(field) => (
            <View className="mt-5 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="font-Inter-SemiBold text-xl text-emerald-950">Imagen de perfil</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickImage}
                className="mt-2 h-24 w-24 self-start overflow-hidden rounded-full border-2 border-emerald-800"
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
          className={`mt-6 self-center rounded-xl ${isLoading ? "bg-emerald-400" : "bg-emerald-600"} px-6 py-3`}
          onPress={() => form.handleSubmit()}
          disabled={isLoading}
        >
          <Text className="font-Inter-SemiBold text-lg text-white">
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  )
}
