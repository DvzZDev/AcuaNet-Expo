export default {
  expo: {
    name: "AcuaNet",
    slug: "AcuaNet",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "acuanet",
    assetBundlePatterns: ["**/*"],

    icon: "./assets/IosIcon.png",

    experiments: {
      tsconfigPaths: true,
    },

    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/Inter.ttf"],
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "AcuaNet necesita acceso a tus fotos para que puedas subir imágenes.",
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
