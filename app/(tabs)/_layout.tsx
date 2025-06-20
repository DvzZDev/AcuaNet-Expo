import { useState } from "react"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import SearchModal from "components/Search/SearchModal"
import "global.css"
import { LinearGradient } from "expo-linear-gradient"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Home03Icon, MapsLocation01Icon, Search02Icon, UserStoryIcon } from "@hugeicons/core-free-icons"
import { useStore } from "store"
import { Image } from "expo-image"

export default function Layout() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const avatarUrl = useStore((state) => state.avatarUrl)

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={false}
      />
      <Tabs
        screenOptions={{
          animation: "fade",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#16151a",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingInline: 10,
          },
          tabBarLabelStyle: {
            color: "#b3e8ba",
            fontFamily: "Inter",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: "Inicio",
            tabBarLabelStyle: {
              color: "#b3e8ba",
              fontFamily: "Inter",
            },
            tabBarIcon: () => (
              <HugeiconsIcon
                icon={Home03Icon}
                size={30}
                color="#b3e8ba"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="searchButton"
          options={{
            tabBarButton: ({ accessibilityState, accessibilityLabel, testID }) => (
              <TouchableOpacity
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                testID={testID}
                onPress={() => setIsModalVisible(true)}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <HugeiconsIcon
                  icon={Search02Icon}
                  size={30}
                  color="#b3e8ba"
                />
                <Text className="font-Inter-Thin text-xs text-[#bcf2c2]">Buscador</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="catchMap"
          options={{
            headerShown: false,
            tabBarLabel: "CatchMap",
            tabBarLabelStyle: {
              color: "#b3e8ba",
              fontFamily: "Inter",
            },
            tabBarIcon: () => (
              <HugeiconsIcon
                icon={MapsLocation01Icon}
                size={30}
                color="#b3e8ba"
              />
            ),
            tabBarStyle: {
              backgroundColor: "#16151a",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingInline: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            },
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Cuenta",
            tabBarIcon: () => (
              <View>
                {avatarUrl?.length ? (
                  <View>
                    <Image
                      source={{ uri: avatarUrl }}
                      style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: "#b3e8ba" }}
                    />
                  </View>
                ) : (
                  <HugeiconsIcon
                    icon={UserStoryIcon}
                    size={30}
                    color="#b3e8ba"
                  />
                )}
              </View>
            ),
          }}
        />
      </Tabs>
      <SearchModal
        isVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  )
}
