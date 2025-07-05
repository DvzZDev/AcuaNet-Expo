import React, { useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { Home03Icon, MapsLocation01Icon, Search02Icon, UserStoryIcon } from "@hugeicons/core-free-icons"
import { useStore } from "../store"
import { Image } from "expo-image"

import HomeScreen from "../screens/HomeScreen"
import CatchMapScreen from "../screens/CatchMapScreen"
import AccountScreen from "../screens/AccountScreen"

import SearchModal from "../components/Search/SearchModal"

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  const avatarUrl = useStore((state) => state.avatarUrl)
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <LinearGradient
        colors={["#effcf3", "#9affa1"]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <Tab.Navigator
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
        <Tab.Screen
          name="Home"
          component={HomeScreen}
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
        <Tab.Screen
          name="Search"
          component={View}
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
                <Text className="font-Inter-Medium text-xs text-[#b3e8ba]">Buscador</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="CatchMap"
          component={CatchMapScreen}
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
        <Tab.Screen
          name="Account"
          component={AccountScreen}
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
      </Tab.Navigator>
      <SearchModal
        isVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  )
}
