import {
  Analytics03Icon,
  ChartLineData02FreeIcons,
  DropletIcon,
  LiveStreaming02Icon,
  RulerIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import { Modal, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import type { EmbalseDataLive, EmbalseDataHistorical } from 'types';
import Chart from './Chart';

interface DataModalProps {
  LiveData?: EmbalseDataLive[] | null;
  HistoricalData?: EmbalseDataHistorical[] | null;
  isOpen: boolean;
  contentKey: string;
  setIsOpen: (isOpen: boolean) => void;
  setContentKey: (contentKey: string) => void;
}

export default function DataModal({
  LiveData,
  HistoricalData,
  isOpen,
  setIsOpen,
  setContentKey,
  contentKey,
}: DataModalProps) {
  const title =
    contentKey === 'livedata'
      ? 'Datos en Tiempo Real'
      : contentKey === 'weekdata'
        ? 'Datos Semanales'
        : 'Datos Históricos';
  const wildcard =
    contentKey === 'livedata'
      ? 'Datos no contrastados'
      : contentKey === 'weekdata'
        ? 'Datos Contrastados'
        : null;
  const icon =
    contentKey === 'livedata'
      ? LiveStreaming02Icon
      : contentKey === 'weekdata'
        ? ChartLineData02FreeIcons
        : contentKey === 'historicaldata'
          ? ChartLineData02FreeIcons
          : null;
  const iconColor =
    contentKey === 'livedata'
      ? '#019FFF'
      : contentKey === 'weekdata'
        ? '#008f00'
        : contentKey === 'historicaldata'
          ? '#C09400'
          : '';
  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      className="flex items-center justify-center"
      transparent={true}
      onRequestClose={() => {
        setIsOpen(false);
      }}>
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center p-3"
        onPressOut={() => {
          setIsOpen(false);
          setContentKey('');
        }}
        style={{ flex: 1 }}>
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <View
          className={twMerge(
            'h-fit w-full rounded-xl p-4',
            contentKey === 'livedata'
              ? 'bg-[#003352]'
              : contentKey === 'weekdata'
                ? 'bg-[#dbfce7]'
                : contentKey === 'historicaldata'
                  ? 'bg-[#141602]'
                  : 'bg-gray-700'
          )}>
          {/* Title */}
          <View className="flex flex-row gap-2">
            <View
              className={twMerge(
                'h-fit self-start rounded-lg border p-1',
                contentKey === 'livedata'
                  ? 'border-[#019FFF]/50 bg-[#bae5ff]'
                  : contentKey === 'weekdata'
                    ? 'border-[#008F06]/50 bg-[#baffbd]'
                    : contentKey === 'historicaldata'
                      ? 'border-[#C09400]/50 bg-[#EFFFBA]'
                      : ''
              )}>
              <View className="flex flex-row items-center gap-2">
                <HugeiconsIcon icon={icon} size={20} color={iconColor} />
                <Text
                  className={twMerge(
                    'font-Inter text-base text-[#019FFF]',
                    contentKey === 'weekdata'
                      ? 'text-[#008F06]'
                      : contentKey === 'livedata'
                        ? 'text-[#019FFF]'
                        : contentKey === 'historicaldata'
                          ? 'text-[#C09400]'
                          : 'text-[#D9F5FF]'
                  )}>
                  {title}
                </Text>
              </View>
            </View>
            {/* Wildcard */}
            <View
              className={twMerge(
                'mt-auto h-fit self-start rounded-lg border border-[#FF8800]/50 bg-[#FFD6A7] px-1',
                contentKey === 'livedata'
                  ? 'border-[#FF8800]/50 bg-[#FFD6A7]'
                  : contentKey === 'weekdata'
                    ? 'border-[#0072FF]/50 bg-[#BEDBFF]'
                    : 'hidden'
              )}>
              <View className="flex flex-row items-center gap-2">
                <Text
                  className={twMerge(
                    'font-Inter text-sm text-[#FF8800]',
                    contentKey === 'weekdata'
                      ? 'text-[#008F06]'
                      : contentKey === 'livedata'
                        ? 'text-[#FF8800]'
                        : 'text-[#D9F5FF]'
                  )}>
                  {wildcard}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Livc Data */}
          <View
            className={`mt-4 flex w-full flex-col ${contentKey === 'livedata' ? 'block' : 'hidden'}`}>
            {/* Table Header */}
            <View className="mb-2 flex w-full flex-row justify-between">
              {
                <>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">
                      Hora
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">
                      Volumen
                    </Text>
                    <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(hm3)</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">
                      Capacidad
                    </Text>
                    <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(%)</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-lg font-bold text-[#D9F5FF]">
                      Cota
                    </Text>
                    <Text className="text-center font-Inter text-xs text-[#D9F5FF]">(msnm)</Text>
                  </View>
                </>
              }
            </View>
            {/* Table Rows */}
            {LiveData &&
              LiveData.map((d) => (
                <View
                  key={d.id}
                  className="mb-1 flex w-full flex-row items-center justify-between rounded-lg border-b border-blue-800 bg-[#044c77] p-1">
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-base text-[#D9F5FF]">
                      {new Date(d.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-base text-[#D9F5FF]">
                      {d.volumen}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-base text-[#D9F5FF]">
                      {d.porcentaje}%
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center font-Inter text-base text-[#D9F5FF]">
                      {d.cota}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
          {/* End contante Live Data */}

          {/* Week data */}
          <View
            className={`${contentKey === 'weekdata' ? 'flex' : 'hidden'} mt-3 flex-col items-center justify-center gap-6 `}>
            <View className="flex w-full flex-row items-center gap-6">
              <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
                <HugeiconsIcon icon={DropletIcon} size={40} color="black" />
              </View>
              <View className="flex-1 flex-col justify-center">
                <Text className="font-Inter text-xl font-semibold text-[#3D7764]">
                  Agua Embalsada
                </Text>
                <Text className="font-Inter-Black text-4xl  text-[#032e15]">
                  {HistoricalData && HistoricalData.length > 0
                    ? HistoricalData[0].volumen_actual
                    : 'N/A'}
                  <Text className="font-Inter-SemiBold text-base "> hm³</Text>
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    height: 12,
                    backgroundColor: '#00c740',
                    borderRadius: 999,
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '100%',
                      width: 8,
                      backgroundColor: 'black',
                      borderRadius: 999,
                    }}
                  />
                </View>
                <Text className="font-Inter-Bold mt-2 text-lg text-[#3D7764] ">
                  {HistoricalData && HistoricalData.length > 0
                    ? HistoricalData[0].porcentaje
                    : 'N/A'}
                  <Text className="font-Inter-Medium text-base"> % capacidad total</Text>
                </Text>
              </View>
            </View>

            <View className="flex w-full flex-row items-center gap-6">
              <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
                <HugeiconsIcon icon={RulerIcon} size={40} color="black" />
              </View>
              <View className="flex-1 flex-col justify-center">
                <Text className="font-Inter text-xl font-semibold text-[#3D7764]">
                  Capacidad Total
                </Text>
                <Text className="font-Inter-Black text-4xl  text-[#032e15]">
                  {HistoricalData && HistoricalData.length > 0
                    ? HistoricalData[0].capacidad_total
                    : 'N/A'}
                  <Text className="font-Inter-Medium text-base"> hm³</Text>
                </Text>
              </View>
            </View>

            <View className="flex w-full flex-row items-center gap-6">
              <View className="h-16 w-16 flex-none items-center justify-center rounded-lg bg-[#6feeac] p-2">
                <HugeiconsIcon icon={Analytics03Icon} size={40} color="black" />
              </View>
              <View className="flex-1 flex-col justify-center">
                <Text className="font-Inter text-xl font-semibold text-[#3D7764]">
                  Nivel (Cota)
                </Text>
                <Text className="font-Inter-Black text-4xl  text-[#032e15]">
                  {LiveData && LiveData.length > 0 ? LiveData[0].cota : 'N/A'}
                  <Text className="font-Inter-Medium text-base"> msnm</Text>
                </Text>
              </View>
            </View>
          </View>

          {/*CHART*/}
          <View
            className={`${contentKey === 'weekdata' ? 'flex' : 'hidden'} mt-3 flex-col items-center justify-center gap-6 `}></View>

          {/* Historical Data Section */}

          {HistoricalData && <Chart data={HistoricalData} />}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
