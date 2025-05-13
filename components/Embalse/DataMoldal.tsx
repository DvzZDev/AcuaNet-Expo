import { LiveStreaming02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import { Modal, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import type { EmbalseDataLive, EmbalseDataHistorical } from 'types';

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
  console.log(contentKey);
  console.log(LiveData);
  const title = contentKey === 'livedata' ? 'Datos en Tiempo Real' : 'Datos Históricos';
  const wildcard =
    contentKey === 'livedata'
      ? 'Datos no contrastados'
      : contentKey === 'historicaldata'
        ? 'Datos contrastados'
        : 'Datos no contrastados';
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
              : contentKey === 'historicaldata'
                ? 'bg-[#6e7d74]'
                : 'bg-gray-700'
          )}>
          {/* Title */}
          <View className="flex flex-row gap-2">
            <View className="h-fit self-start rounded-lg border border-[#019FFF]/50 bg-[#bae5ff] p-1">
              <View className="flex flex-row items-center gap-2">
                <HugeiconsIcon icon={LiveStreaming02Icon} size={20} color={'#019FFF'} />
                <Text className="font-Inter text-base text-[#019FFF]">{title}</Text>
              </View>
            </View>
            {/* Wildcard */}
            <View className="mt-auto h-fit self-start rounded-lg border border-[#FF8800]/50 bg-[#FFD6A7] px-1">
              <View className="flex flex-row items-center gap-2">
                <Text className="font-Inter text-sm text-[#FF8800]">{wildcard}</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="mt-4 flex w-full flex-col">
            {/* Table Header */}
            <View className="mb-2 flex w-full flex-row justify-between">
              {
                <>
                  <View className="flex-1">
                    <Text className="text-center text-lg font-bold text-[#D9F5FF]">Hora</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-lg font-bold text-[#D9F5FF]">Volumen</Text>
                    <Text className="text-center text-xs text-[#D9F5FF]">(hm3)</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-lg font-bold text-[#D9F5FF]">Capacidad</Text>
                    <Text className="text-center text-xs text-[#D9F5FF]">(%)</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-lg font-bold text-[#D9F5FF]">Cota</Text>
                    <Text className="text-center text-xs text-[#D9F5FF]">(msnm)</Text>
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
                    <Text className="text-center text-base text-[#D9F5FF]">
                      {new Date(d.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-base text-[#D9F5FF]">{d.volumen}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-base text-[#D9F5FF]">{d.porcentaje}%</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-center text-base text-[#D9F5FF]">{d.cota}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
