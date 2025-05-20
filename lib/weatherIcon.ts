// Mapeo de los iconos de la API del clima a nuestros iconos locales
export function getWeatherIcon(iconName: string) {
  // Mapa de conversión de nombres de iconos de la API a nuestros archivos locales
  const iconMap: Record<string, any> = {
    // Iconos estándar de día
    "clear-day": require("../assets/weather-icons/clear-day.png"),
    "partly-cloudy-day": require("../assets/weather-icons/partly-cloudy-day.png"),
    cloudy: require("../assets/weather-icons/cloudy.png"),
    rain: require("../assets/weather-icons/rain.png"),
    snow: require("../assets/weather-icons/snow.png"),
    fog: require("../assets/weather-icons/fog.png"),
    wind: require("../assets/weather-icons/wind.png"),

    // Iconos de noche
    "clear-night": require("../assets/weather-icons/clear-night.png"),
    "partly-cloudy-night": require("../assets/weather-icons/partly-cloudy-night.png"),

    // Iconos especiales
    sunrise: require("../assets/weather-icons/sun-rise.png"),
    sunset: require("../assets/weather-icons/sun-down.png"),

    // Fallback
    default: require("../assets/weather-icons/cloudy.png"),
  }

  // Devuelve el icono correspondiente o el icono por defecto si no existe
  return iconMap[iconName] || iconMap.default
}
