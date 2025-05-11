import { Modal, TouchableOpacity, View, StyleSheet, Text, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { BlurView } from 'expo-blur';
import Names from 'lib/Names.json';
import SearchBar from 'assets/icons/searchBar';
import Drop from 'assets/icons/drop';
import { useState } from 'react';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  LinearTransition,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

type SearchModalProps = {
  isVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
};

interface NamesType {
  nombre: string;
  pais: string;
}

export default function SearchModal({ isVisible, setIsModalVisible }: SearchModalProps) {
  const [searchText, setSearchText] = useState('');
  const FilteredNames = Names.filter((n: NamesType) =>
    n.nombre.toLowerCase().includes(searchText.toLowerCase())
  ).slice(0, 5);

  const keyboard = useAnimatedKeyboard();
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 2 }],
  }));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsModalVisible(false);
      }}>
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center p-3"
        onPressOut={() => setIsModalVisible(false)}
        style={{ flex: 1 }}>
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <Animated.View
          className="h-auto w-full rounded-3xl bg-black/50 p-3"
          style={[animatedStyles]}
          layout={LinearTransition}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}>
          <View className="relative mt-5 flex h-12 w-full flex-row items-center rounded-xl bg-green-400/10 px-2">
            <Drop />
            <TextInput
              onChange={(e) => setSearchText(e.nativeEvent.text)}
              className="ml-2 h-40 flex-1 text-[#93ffb7]"
              placeholder="Buscar Embalse..."
              placeholderTextColor="#93ffb796"
              value={searchText}
            />
            <SearchBar />
          </View>
          <Animated.View
            layout={LinearTransition}
            className={`mt-2 w-full rounded-xl bg-[#6e7d74] p-2 ${searchText.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            {searchText.length > 0 &&
              FilteredNames.map((e) => (
                <Link
                  key={e.nombre}
                  href={{
                    pathname: '/embalse/[embalse]',
                    params: { embalse: e.nombre },
                  }}
                  onPress={() => setIsModalVisible(false)}>
                  <Animated.View
                    key={e.nombre}
                    entering={FadeIn.duration(250)}
                    exiting={FadeOut.duration(250)}
                    layout={LinearTransition}>
                    <Text className="text-xl text-[#93ffb7]">{e.nombre}</Text>
                  </Animated.View>
                </Link>
              ))}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
