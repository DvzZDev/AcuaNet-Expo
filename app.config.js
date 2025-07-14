export default {
  expo: {
    name: "AcuaNet",
    slug: "AcuaNet",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "acuanet",
    platforms: ["ios", "android"],
    assetBundlePatterns: ["**/*"],
    icon: "./assets/IosIcon.png",

    experiments: {
      tsconfigPaths: true,
    },

    plugins: [
      "expo-system-ui",
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/Inter.ttf"],
        },
      ],
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "AcuaNet necesita acceso a tus fotos para que puedas subir imágenes.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/LogoE.png",
          resizeMode: "contain",
          backgroundColor: "#16151a",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow AcuaNet to access your photos.",
          savePhotosPermission: "Allow AcuaNet to save photos.",
          isAccessMediaLocationEnabled: true,
        },
      ],
    ],

    ios: {
      bundleIdentifier: "com.dvzz.AcuaNet",
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: "com.dvzz.AcuaNet",
      adaptiveIcon: {
        foregroundImage: "./assets/AndroidIcon.png",
        backgroundImage: "./assets/Android-Icon-Bg.png",
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_GOOGLE_MAPS_API_KEY,
        },
      },
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "acuanet",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    extra: {
      eas: {
        projectId: "cbd687c4-483a-4df3-b443-94debaf44880",
      },
      googleMapsApiKey: process.env.EXPO_GOOGLE_MAPS_API_KEY,
      router: {},
    },
  },
}
