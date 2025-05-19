// filepath: /home/dvzz/Repositories/AcuaNet-App/lib/getWeather.ts
import { useState, useEffect } from "react"

export type WeatherData = {
  queryCost: number
  latitude: number
  longitude: number
  resolvedAddress: string
  address: string
  timezone: string
  tzoffset: number
  description: string
  days: any[]
  currentConditions: any
}

export function useWeather(loc: string) {
  const [location, setLocation] = useState<[string | null, string | null]>([null, null])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getLocation = async () => {
      if (!loc) return

      try {
        const url = `https://nominatim.openstreetmap.org/search.php?q=Embalse de ${loc}&format=jsonv2&countrycodes=ES&extratags=1&addressdetails=1`
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            Accept: "application/json",
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from location API")
        }
        const data = await response.json()
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No location data found")
        }
        setLocation([data[0].lat, data[0].lon])
      } catch (error) {
        console.error("Error fetching location data:", error)
        setError(String(error))
        setLoading(false)
      }
    }

    getLocation()
  }, [loc])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const key = process.env.EXPO_PUBLIC_WEATHER_KEY
        const [lat, lon] = location
        if (!lat || !lon) return

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindspeed%2Cwindspeedmax%2Cwindspeedmean%2Cwindspeedmin%2Cwinddir%2Cpressure%2Cvisibility%2Csolarradiation%2Cuvindex%2Csevererisk%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon%2Csource&include=days%2Chours%2Ccurrent%2Cfcst%2Cobs%2Cremote%2Cstats%2Cstatsfcst&key=${key}&contentType=json`

        const response = await fetch(url)
        const weatherData = await response.json()
        setWeather(weatherData)
      } catch (error) {
        console.error("Error fetching weather data:", error)
        setError(String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location])

  return { weather, loading, error }
}
