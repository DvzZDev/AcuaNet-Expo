import React, { useState } from "react"
import { View, Dimensions, StyleSheet, Modal, TouchableOpacity } from "react-native"
import Carousel from "react-native-reanimated-carousel"
import { ImageZoom } from "@likashefqet/react-native-image-zoom"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"

const defaultDataWith6Colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

// Componente envuelto con gestureHandlerRootHOC para Android
const ModalContentWithGestures = gestureHandlerRootHOC(
  ({
    onPress,
    selectedImage,
    windowWidth,
    windowHeight,
  }: {
    onPress: () => void
    selectedImage: string | null
    windowWidth: number
    windowHeight: number
  }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: "#000",
        width: windowWidth,
        height: windowHeight,
        justifyContent: "center",
        alignItems: "center",
      }}
      activeOpacity={1}
      onPress={onPress}
    >
      <ImageZoom
        uri={
          `https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${selectedImage}` ||
          "https://placehold.co/600x400/EEE/31343C"
        }
        style={{
          width: windowWidth,
          height: windowHeight,
        }}
        resizeMode="contain"
        isPinchEnabled={true}
        isDoubleTapEnabled={true}
      />
    </TouchableOpacity>
  )
)

export default function ImageCarrousel({ paths }: { paths?: string[] }) {
  const displayData = paths && paths.length > 0 ? paths : defaultDataWith6Colors
  const windowWidth = Dimensions.get("window").width
  const windowHeight = Dimensions.get("window").height
  const [currentIndex, setCurrentIndex] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openImageModal = (imagePath: string) => {
    if (!imagePath.startsWith("#")) {
      setSelectedImage(imagePath)
      setModalVisible(true)
    }
  }

  const closeImageModal = () => {
    setModalVisible(false)
    setSelectedImage(null)
  }

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      key={index}
      style={{
        backgroundColor: item.startsWith("#") ? item : "transparent",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
      onPress={() => openImageModal(item)}
      activeOpacity={item.startsWith("#") ? 1 : 0.8}
    >
      {!item.startsWith("#") ? (
        <ImageZoom
          uri={`https://rxxyplqherusqxdcowgh.supabase.co/storage/v1/object/public/accounts/${item}`}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          isDoubleTapEnabled={false}
          isPinchEnabled={false}
        />
      ) : null}
    </TouchableOpacity>
  )

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop={displayData.length > 1}
        width={windowWidth}
        height={323}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={paths && paths.length > 0 ? 3000 : 2000}
        data={displayData}
        style={{ width: "100%", borderBottomEndRadius: 15, borderBottomStartRadius: 20 }}
        onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
          "worklet"
          g.enabled(false)
        }}
        onSnapToItem={(index: number) => {
          setCurrentIndex(index)
        }}
        renderItem={renderItem}
      />

      {displayData.length > 1 && (
        <View style={styles.pagination}>
          {displayData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { backgroundColor: index === currentIndex ? "#14b981" : "#14b98246" }]}
            />
          ))}
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeImageModal}
        statusBarTranslucent={true}
      >
        <ModalContentWithGestures
          onPress={closeImageModal}
          selectedImage={selectedImage}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
})
