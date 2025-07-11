const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config")

const config = getDefaultConfig(__dirname)

// Disable package exports resolution
config.resolver.unstable_enablePackageExports = false

module.exports = wrapWithReanimatedMetroConfig(withNativeWind(config, { input: "./global.css" }))
