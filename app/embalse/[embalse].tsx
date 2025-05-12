import { Stack, useLocalSearchParams } from 'expo-router';
import { fetchData } from 'querys';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { EmbalseData } from '../../types';
import Calendar from '@assets/icons/calendar';
import Ai from '@assets/icons/ai';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CalendarCheckIn01Icon,
  ChartLineData02FreeIcons,
  LiveStreaming02Icon,
  MapsLocation01Icon,
  MoonIcon,
  RainbowIcon,
  StarIcon,
} from '@hugeicons/core-free-icons';

export default function Embalse() {
  const [data, setData] = useState<EmbalseData[] | null>(null);
  const { embalse } = useLocalSearchParams();
  const codedEmbalse = Array.isArray(embalse) ? embalse[0] : embalse;
  console.log('Embalse:', codedEmbalse);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData(embalse, codedEmbalse, setData);
    };
    fetchDataAsync();
  }, [codedEmbalse, embalse]);

  console.log('Data:', data);

  return (
    <>
      <Stack.Screen
        options={{
          title: embalse ? (Array.isArray(embalse) ? embalse[0] : embalse) : 'N/D',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
            fontFamily: 'Inter',
          },
          contentStyle: {
            backgroundColor: 'transparent',
            padding: 10,
          },
          headerStyle: {
            backgroundColor: '#effcf3',
          },
          headerRight: () => (
            <Image
              source={require('../../assets/LogoBlack.png')}
              style={{
                width: 140,
                height: 35,
                marginLeft: 'auto',
              }}
            />
          ),
          headerLeft: () => null,
        }}
      />
      <LinearGradient
        colors={['#effcf3', '#acd9af']}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-col justify-center gap-1">
          <Text className="font-Inter text-2xl text-[#032E15]">
            Cuanca del {data && data[0].cuenca}{' '}
          </Text>
          <View className="flex flex-row gap-2">
            <Calendar />
            <Text className="font-Inter">
              Ult. Actualización -{' '}
              {data &&
                new Date(data[0].fecha).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
            </Text>
          </View>
        </View>
        <HugeiconsIcon icon={StarIcon} size={30} color={'black'} />
      </View>

      <View className="mt-5 h-[8rem] w-full rounded-lg bg-green-300"></View>
      <View className="ml-auto flex flex-row items-center justify-center gap-1 text-xs">
        <Ai />
        <Text className="font-Inter">AcuaNet AI puede cometer errores</Text>
      </View>

      <View className="mt-10 flex flex-col gap-5">
        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#019FFF]/50 bg-[#bae5ff] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={LiveStreaming02Icon} size={30} color={'#019FFF'} />
            <Text className="font-Inter text-xl text-[#019FFF]">Datos en Tiempo Real</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#008F06]/50 bg-[#BAFFBD] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={CalendarCheckIn01Icon} size={30} color={'#008F06'} />
            <Text className="font-Inter text-xl text-[#008F06]">Datos Semanales</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#C09400]/50 bg-[#EFFFBA] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={ChartLineData02FreeIcons} size={30} color={'#C09400'} />
            <Text className="font-Inter text-xl text-[#C09400]">Datos Semanales</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#9000FF]/50 bg-[#E1BAFF] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={RainbowIcon} size={30} color={'#9000FF'} />
            <Text className="font-Inter text-xl text-[#9000FF]">Predicción Meteorológica</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#FF8900]/50 bg-[#FFDFBA] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={MapsLocation01Icon} size={30} color={'#FF8900'} />
            <Text className="font-Inter text-xl text-[#FF8900]">
              Mapas: Topográfico y de Viento
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="h-fit self-start rounded-lg border border-[#0051FF]/50 bg-[#BAD0FF] p-2">
          <View className="flex flex-row items-center gap-2">
            <HugeiconsIcon icon={MoonIcon} size={30} color={'#0051FF'} />
            <Text className="font-Inter text-xl text-[#0051FF]">Tabla Lunar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
