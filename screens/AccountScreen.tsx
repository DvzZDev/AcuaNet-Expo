import { supabase } from "../lib/supabase"
import { Alert, Text, TouchableOpacity, View, TextInput, Modal } from "react-native"
import { useEffect, useLayoutEffect, useState } from "react"
import { Image } from "expo-image"
import { useStore } from "../store"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { RootStackNavigationProp } from "types/index"
import { useNavigation } from "@react-navigation/native"
import { ScrollView } from "react-native-gesture-handler"
import { useAccountData } from "querys"
import { HugeiconsIcon } from "@hugeicons/react-native"
import {
  Album02Icon,
  ArrowRight01Icon,
  Delete02Icon,
  EditUser02Icon,
  FireIcon,
  Invoice03Icon,
  Logout02Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons"
import EditProfileBottomSheet from "@components/Account/EditProfileBottomSheet"

export default function AccountScreen() {
  const userId = useStore((state) => state.id)
  const navigation = useNavigation<RootStackNavigationProp<"Account">>()
  const insets = useSafeAreaInsets()
  const userData = useAccountData(userId || "")
  const [isBtsEditrOpen, setIsBtsEditrOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#effcf3",
      },
      headerShown: true,
      headerShadowVisible: false,
      headerTitleAlign: "left",
      animation: "fade",

      headerTitle: () => (
        <Text className="font-Inter-Medium text-3xl">
          Cuenta Acua<Text className="font-Inter-Black text-4xl text-emerald-500">Net</Text>
        </Text>
      ),
    })
  })

  useEffect(() => {
    if (!userId) {
      console.log("Waiting for user ID from store...")
      return
    }
  }, [userId])

  const signOut = async () => {
    Alert.alert(
      "¿Cerrar sesión?",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: async () => {
            await supabase.auth.signOut()
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            })
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    )

    console.log("User signed out")
  }

  const deleteAccount = async () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== "confirmar") {
      Alert.alert("Error", "Debes escribir 'confirmar' para borrar tu cuenta")
      return
    }

    try {
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        Alert.alert("Error", "No hay sesión activa")
        return
      }
      const accessToken = session.access_token

      const { error } = await supabase.functions.invoke("delete-user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (error) {
        console.error("Error al eliminar la cuenta:", error)
        Alert.alert("Error", "No se pudo borrar la cuenta. Inténtalo de nuevo más tarde.")
        return
      }

      Alert.alert("Éxito", "Tu cuenta ha sido eliminada correctamente.")
      await supabase.auth.signOut()
      navigation.navigate("Welcome")
    } catch (error) {
      console.error("Error al borrar la cuenta:", error)
      Alert.alert("Error", "No se pudo borrar la cuenta. Inténtalo de nuevo más tarde.")
    } finally {
      setConfirmText("")
      setShowDeleteModal(false)
    }
  }

  const cancelDeleteAccount = () => {
    setConfirmText("")
    setShowDeleteModal(false)
  }

  const { avatar, name, lastname } = userData.data || {}

  console.log("User Data:", avatar)

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }, { zIndex: -1 }]}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="mt-4 flex-col items-center justify-center px-4">
            <View
              style={{ borderWidth: 3 }}
              className="relative mb-4 h-48 w-48 rounded-full border-purple-500 p-[2px]"
            >
              <Image
                source={{
                  uri: avatar
                    ? `${avatar}?t=${new Date().getTime()}`
                    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
                }}
                style={{ width: "100%", height: "100%", borderRadius: 9999 }}
                contentFit="contain"
              />

              <View className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex-row items-center justify-center rounded-full bg-purple-500 px-2 py-1">
                <Text className="font-Inter-SemiBold text-sm text-white">Premium</Text>
              </View>
            </View>

            <View className="flex-col items-center justify-center gap-1">
              <Text className="font-Inter-Bold text-2xl text-emerald-950">
                {name} {lastname?.split(" ")[0]}
              </Text>
              <Text className="font-Inter-Medium text-lg text-emerald-800">En AcuaNet desde 19 Jun 2025</Text>
            </View>
          </View>

          <View className="mx-10 mt-8 flex-col rounded-xl bg-green-50 shadow-md">
            <TouchableOpacity
              onPress={() => setIsBtsEditrOpen(true)}
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
              className="flex-row items-center gap-3 p-2"
            >
              <View className="items-center justify-center rounded-xl bg-emerald-600 p-2">
                <HugeiconsIcon
                  icon={EditUser02Icon}
                  size={25}
                  color="white"
                  strokeWidth={2}
                />
              </View>
              <Text className="font-Inter-Medium text-xl text-emerald-600">Editar Perfil</Text>
              <View className="ml-auto">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={25}
                  color="#059669"
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Gallery")}
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
              className="flex-row items-center gap-3 p-2"
            >
              <View className="items-center justify-center rounded-xl bg-emerald-600 p-2">
                <HugeiconsIcon
                  icon={Album02Icon}
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />
              </View>
              <Text className="font-Inter-Medium text-xl text-emerald-600">Galería</Text>
              <View className="ml-auto">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={25}
                  color="#059669"
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ""}
              className="flex-row items-center gap-3 p-2"
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
            >
              <View className="items-center justify-center rounded-xl bg-emerald-600 p-2">
                <HugeiconsIcon
                  icon={Notification01Icon}
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />
              </View>
              <Text className="font-Inter-Medium text-xl text-emerald-600">Mi suscripción</Text>
              <View className="ml-auto">
                <HugeiconsIcon
                  icon={FireIcon}
                  size={24}
                  color="white"
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ""}
              className="flex-row items-center gap-3 p-2"
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
            >
              <View className="items-center justify-center rounded-xl bg-emerald-600 p-2">
                <HugeiconsIcon
                  icon={Invoice03Icon}
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />
              </View>
              <Text className="font-Inter-Medium text-xl text-emerald-600">Historial de pagos</Text>
              <View className="ml-auto">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={25}
                  color="#059669"
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ""}
              className="flex-row items-center gap-3 p-2"
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
            >
              <View className="items-center justify-center rounded-xl bg-emerald-600 p-2">
                <HugeiconsIcon
                  icon={Notification01Icon}
                  size={25}
                  color="white"
                  strokeWidth={1.5}
                />
              </View>
              <Text className="font-Inter-Medium text-xl text-emerald-600">Configurar notificaciones</Text>
              <View className="ml-auto">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={25}
                  color="#059669"
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mx-10 mt-5 flex-col rounded-xl bg-red-100">
            <TouchableOpacity
              onPress={() => signOut()}
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
              className="flex-row items-center justify-center gap-3 p-3"
            >
              <HugeiconsIcon
                icon={Logout02Icon}
                size={30}
                color="red"
                strokeWidth={1.5}
              />
              <Text className="font-Inter-Medium text-xl text-red-600">Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View className="mx-10 mt-2 flex-col rounded-xl bg-gray-300">
            <TouchableOpacity
              onPress={deleteAccount}
              style={{ borderBottomWidth: 1, borderColor: "#a7f3d0" }}
              className="flex-row items-center justify-center gap-3 p-3"
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                size={30}
                color="gray"
                strokeWidth={1.5}
              />
              <Text className="font-Inter-Medium text-xl text-gray-600">Borrar Cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity onPress={signOut}>
            <Text>Cerrar Sesión</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      {userData.data && (
        <EditProfileBottomSheet
          setOpen={setIsBtsEditrOpen}
          open={isBtsEditrOpen}
          userData={userData.data}
        />
      )}

      {/* Modal para confirmar borrado de cuenta */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelDeleteAccount}
        statusBarTranslucent={true}
      >
        <View
          className="flex-1 items-center justify-center bg-black/50"
          style={{ marginTop: 0 }}
        >
          <View className="w-10/12 rounded-xl bg-white p-5">
            <Text className="mb-4 font-Inter-Bold text-xl text-emerald-950">¿Borrar cuenta?</Text>
            <Text className="mb-6 font-Inter-Medium text-base text-gray-600">
              ⚠️ Esta acción eliminará todos tus favoritos y datos del CatchMap de forma permanente.{"\n"}
              No podrás recuperar nada una vez completada.{"\n\n"}
              Para confirmar, escribe &quot;confirmar&quot; en el campo de abajo:
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="Escribe 'confirmar'"
              className="font-Inter-Regular mb-4 rounded-lg border border-gray-300 p-3"
            />

            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                className="rounded-lg bg-gray-200 px-4 py-2"
                onPress={cancelDeleteAccount}
              >
                <Text className="font-Inter-Medium text-black">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-lg bg-red-500 px-4 py-2"
                onPress={confirmDeleteAccount}
              >
                <Text className="font-Inter-Medium text-white">Borrar Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
