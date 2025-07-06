import { Moon } from "lunarphase-js"

export interface DailyFishingActivity {
  date: string
  dayName: string
  lunarAge: number
  lunarPhase: string
  activityLevel: number
  activityEmoji: string
  visibility: string
  weatherConditions?: {
    temp?: number
    windSpeed?: number
    rainfall?: number
    condition?: string
  }
}

export function getFishActivityLevel(age: number): number {
  const normalizedAge = age % 29.5
  const distanceToNewMoon = Math.min(normalizedAge, 29.5 - normalizedAge)
  const distanceToFullMoon = Math.abs(normalizedAge - 14.75)
  const minDistance = Math.min(distanceToNewMoon, distanceToFullMoon)

  if (minDistance <= 1.5) {
    return 3 // Alta actividad
  } else if (minDistance <= 3) {
    return 2 // Actividad media
  } else {
    return 1 // Actividad baja
  }
}

export function getFishActivityEmoji(activityLevel: number): string {
  return "🐟".repeat(activityLevel)
}

function getMoonVisibility(age: number): string {
  const illumination = (1 - Math.cos((2 * Math.PI * age) / 29.5)) / 2
  const percentage = Math.round(illumination * 100).toFixed(0)
  return `${percentage}%`
}

function getDayName(date: Date): string {
  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  return dayNames[date.getDay()]
}

export function getNext7DaysFishingActivity(weatherData?: any): DailyFishingActivity[] {
  const activities: DailyFishingActivity[] = []
  // Normalizar la fecha a medianoche para que el cache funcione correctamente<
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const lunarAge = Moon.lunarAge(currentDate)
    const lunarPhase = Moon.lunarPhaseEmoji(currentDate)
    const lunarPhaseName = translateLunarPhase(Moon.lunarPhase(currentDate))
    const activityLevel = getFishActivityLevel(lunarAge)
    const activityEmoji = getFishActivityEmoji(activityLevel)
    const visibility = getMoonVisibility(lunarAge)

    // Obtener condiciones meteorológicas si están disponibles
    let weatherConditions = undefined
    if (weatherData?.days && weatherData.days[i]) {
      const dayWeather = weatherData.days[i]
      weatherConditions = {
        temp: Math.round((dayWeather.tempmax + dayWeather.tempmin) / 2),
        windSpeed: Math.round(dayWeather.windspeed),
        rainfall: dayWeather.precip || 0,
        condition: dayWeather.conditions || dayWeather.description,
      }
    }

    activities.push({
      date: currentDate.toISOString().split("T")[0],
      dayName: getDayName(currentDate),
      lunarAge,
      lunarPhase,
      activityLevel,
      activityEmoji,
      visibility,
      weatherConditions,
    })
  }

  return activities
}

export function generateFishingActivitySummary(activities: DailyFishingActivity[]): string {
  const today = activities[0]
  const highActivityDays = activities.filter((a) => a.activityLevel >= 3)
  const mediumActivityDays = activities.filter((a) => a.activityLevel === 2)

  let summary = `Pronóstico de actividad de pesca para los próximos 7 días:\n\n`

  // Resumen de hoy
  summary += `🎣 Hoy (${today.dayName}): ${today.activityEmoji} Actividad ${today.activityLevel === 3 ? "Alta" : today.activityLevel === 2 ? "Media" : "Baja"}`
  if (today.weatherConditions) {
    summary += ` - ${today.weatherConditions.temp}°C, viento ${today.weatherConditions.windSpeed} km/h`
  }
  summary += `\n\n`

  // Mejores días
  if (highActivityDays.length > 0) {
    summary += `🌟 Mejores días: ${highActivityDays.map((d) => d.dayName).join(", ")}\n`
  }

  if (mediumActivityDays.length > 0) {
    summary += `✅ Días con actividad media: ${mediumActivityDays.map((d) => d.dayName).join(", ")}\n`
  }

  // Información lunar
  const newMoonDays = activities.filter((a) => a.lunarAge < 2 || a.lunarAge > 27.5)
  const fullMoonDays = activities.filter((a) => a.lunarAge > 12.75 && a.lunarAge < 16.25)

  if (newMoonDays.length > 0) {
    summary += `🌑 Luna nueva favorable: ${newMoonDays.map((d) => d.dayName).join(", ")}\n`
  }

  if (fullMoonDays.length > 0) {
    summary += `🌕 Luna llena favorable: ${fullMoonDays.map((d) => d.dayName).join(", ")}\n`
  }

  return summary
}

export function translateLunarPhase(phase: string): string {
  const phaseTranslations: Record<string, string> = {
    New: "Luna Nueva",
    "Waxing Crescent": "Luna Creciente",
    "First Quarter": "Cuarto Creciente",
    "Waxing Gibbous": "Gibosa Creciente",
    Full: "Luna Llena",
    "Waning Gibbous": "Gibosa Menguante",
    "Last Quarter": "Cuarto Menguante",
    "Waning Crescent": "Luna Menguante",
  }

  return phaseTranslations[phase] || phase
}
