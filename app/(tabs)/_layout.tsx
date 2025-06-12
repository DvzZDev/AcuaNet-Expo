import { useState } from "react"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Home from "assets/icons/home"
import Map from "assets/icons/map"
import Search from "assets/icons/search"
import SearchModal from "components/Search/SearchModal"

import "global.css"
import { LinearGradient } from "expo-linear-gradient"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Home03Icon, MapsLocation01Icon, Search02Icon, UserStoryIcon } from "@hugeicons/core-free-icons"

export default function Layout() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
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
          name="geocode"
          options={{
            title: "CatchMap",
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
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: () => (
              <HugeiconsIcon
                icon={UserStoryIcon}
                size={30}
                color="#b3e8ba"
              />
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
