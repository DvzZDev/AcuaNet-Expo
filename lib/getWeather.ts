import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import mockWeatherData from "../components/Embalse/data.json"

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

export type UnifiedCoordinates = {
  lat: number | null
  lng: number | null
  source: "database" | "nominatim" | null
}

export function useWeather(loc: string, embalseCoded: string) {
  const [coordinates, setCoordinates] = useState<UnifiedCoordinates>({ lat: null, lng: null, source: null })
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getUnifiedCoordinates = async () => {
      if (!loc || !embalseCoded) return

      try {
        const { data: dbCoords, error: dbError } = await supabase
          .from("embalses_coords")
          .select("lat, long")
          .eq("embalse", embalseCoded)
          .limit(1)

        if (!dbError && dbCoords && dbCoords.length > 0 && dbCoords[0].lat !== null && dbCoords[0].long !== null) {
          setCoordinates({
            lat: dbCoords[0].lat,
            lng: dbCoords[0].long,
            source: "database",
          })
          return
        }

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

        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          source: "nominatim",
        })
      } catch (error) {
        setError(String(error))
        setCoordinates({ lat: null, lng: null, source: null })
      }
    }

    getUnifiedCoordinates()
  }, [loc, embalseCoded])

  useEffect(() => {
    // COMMENTED FOR DEVELOPMENT - USING MOCK DATA TO SAVE API REQUESTS
    // UNCOMMENT FOR PRODUCTION
    /*
    const fetchWeather = async () => {
      try {
        const key = process.env.EXPO_PUBLIC_WEATHER_KEY
        const { lat, lng } = coordinates
        if (!lat || !lng) return

        if (!key) {
          throw new Error("Weather API key is not configured")
        }

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lng}/next15days?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Cdew%2Chumidity%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Cwindgust%2Cwindspeed%2Cwindspeedmax%2Cwindspeedmean%2Cwindspeedmin%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon&key=${key}&contentType=json`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Weather API HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")

        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text()
          throw new Error(`Received non-JSON response: ${textResponse.substring(0, 200)}...`)
        }

        const weatherData = await response.json()
        setWeather(weatherData)
      } catch (error) {
        setError(String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    */

    // USING MOCK DATA FOR DEVELOPMENT
    const loadMockWeather = () => {
      try {
        setWeather(mockWeatherData as WeatherData)
      } catch (error) {
        setError(String(error))
      } finally {
        setLoading(false)
      }
    }

    if (coordinates.lat && coordinates.lng) {
      loadMockWeather()
    } else if (coordinates.lat === null && coordinates.lng === null && coordinates.source === null) {
      loadMockWeather()
    }
  }, [coordinates])

  return { weather, loading, error, coordinates }
}
