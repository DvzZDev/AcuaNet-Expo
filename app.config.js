export default {
  expo: {
    name: "AcuaNet",
    slug: "AcuaNet",
    version: "1.0.0",
    web: {
      favicon: "./assets/favicon.png",
    },
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
        "expo-splash-screen",
        {
          image: "./assets/LogoE.png",
          resizeMode: "contain",
          backgroundColor: "#16151a",
        },
      ],
    ],
    orientation: "portrait",
    icon: "./assets/Icon-Ios.png",
    userInterfaceStyle: "light",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.dvzz.AcuaNet",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    scheme: "acuanet",
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/Icon-Android.png",
      },
      package: "com.dvzz.AcuaNet",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    extra: {
      router: {},
      eas: {
        projectId: "cbd687c4-483a-4df3-b443-94debaf44880",
      },
      googleMapsApiKey: process.env.EXPO_GOOGLE_MAPS_API_KEY,
    },
  },
}
