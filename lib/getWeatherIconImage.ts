/**
 * Maps the weather icon name to the appropriate image asset
 *
 * @param iconName - The icon name from the weather API
 * @returns The image source for the React Native Image component
 */
export function getWeatherIcon(iconName: string | undefined) {
  if (!iconName) {
    return null
  }

  // Use a type-safe approach with a mapping object
  const weatherIcons: Record<string, any> = {
    rain: require("../assets/weather-icons/rain.png"),
    "clear-day": require("../assets/weather-icons/clear-day.png"),
    "clear-night": require("../assets/weather-icons/clear-night.png"),
    cloudy: require("../assets/weather-icons/cloudy.png"),
    fog: require("../assets/weather-icons/fog.png"),
    "partly-cloudy-day": require("../assets/weather-icons/partly-cloudy-day.png"),
    "partly-cloudy-night": require("../assets/weather-icons/partly-cloudy-night.png"),
    snow: require("../assets/weather-icons/snow.png"),
    "sun-down": require("../assets/weather-icons/sun-down.png"),
    "sun-rise": require("../assets/weather-icons/sun-rise.png"),
    wind: require("../assets/weather-icons/wind.png"),
  }

  return weatherIcons[iconName] || null
}
