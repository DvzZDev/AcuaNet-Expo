import { useState } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';
import Home from 'assets/icons/home';
import Map from 'assets/icons/map';
import Search from 'assets/icons/search';
import SearchModal from 'components/Search/SearchModal';

import 'global.css';

export default function Layout() {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#effcf3" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#001c11',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            color: '#b3e8ba',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: () => <Home />,
          }}
        />
        <Tabs.Screen
          name="searchButton"
          options={{
            tabBarIcon: () => <Search />,
            tabBarLabel: 'Search',
            tabBarButton: ({ accessibilityState, accessibilityLabel, testID }) => (
              <TouchableOpacity
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                testID={testID}
                onPress={(e) => {
                  setIsModalVisible(true);
                }}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Search />
                <Text className="text-xs text-[#bcf2c2]">Search</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="geocode"
          options={{
            title: 'GeoCode',
            tabBarIcon: () => <Map />,
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: () => <Home />,
          }}
        />
      </Tabs>
      <SearchModal isVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </>
  );
}
