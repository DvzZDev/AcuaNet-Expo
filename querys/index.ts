/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import CacheClient from "cache"
import hashTextToSha256 from "lib/HashText"
import { supabase } from "lib/supabase"
import type { catchReport, CatchReportDB, EmbalseDataHistorical, FavSection } from "types/index"
import { v4 as uuidv4 } from "uuid"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"

export const CheckCoords = async (embalse: string | string[], setCheckCoords: (data: any) => void) => {
  try {
    const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse

    const { data, error } = await supabase
      .from("embalses_coords")
      .select()
      .eq("embalse", typeof embalseStr === "string" ? embalse : embalseStr)
      .limit(1)

    if (error) {
      setCheckCoords([])
      return
    }

    setCheckCoords(data || [])
  } catch {
    setCheckCoords([])
  }
}

async function savedCache({ token, data }: { token: string; data: string }) {
  try {
    await CacheClient.set(token, data, { EX: 3600 })
  } catch {}
}

function normalizeForCache(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeForCache)
  }

  const normalized: any = {}
  const keys = Object.keys(obj).sort()

  for (const key of keys) {
    normalized[key] = normalizeForCache(obj[key])
  }

  return normalized
}

export const simpleGeminiAI = async (
  weather: any,
  embalse: {
    embalse: {
      name: string
      nivel: number
      porcentaje: number
    }
  },
  fish_activity: any
): Promise<string> => {
  try {
    const normalizedWeather = normalizeForCache(weather)
    const normalizedFishActivity = normalizeForCache(fish_activity)

    const prompt = `
  Resume los datos meteorológicos y de actividad de peces para los próximos 7 días. Usa SOLO la información proporcionada, no inventes datos.

  📊 **Datos del embalse:**
  - **Embalse:** ${embalse.embalse.name}
  - **Nivel actual:** ${embalse.embalse.nivel} m (${embalse.embalse.porcentaje}% de capacidad)
  - **Pronóstico meteorológico:** ${JSON.stringify(normalizedWeather, null, 2)}
  - **Actividad de peces:** ${JSON.stringify(normalizedFishActivity, null, 2)}

  🎣 **INSTRUCCIONES:**
  - NUNCA uses frases como: "Aquí tienes", "Te presento", "Aquí está el resumen", "Para los próximos días", etc.
  - Comienza DIRECTAMENTE con la información más relevante
  - Escribe en UN SOLO PÁRRAFO de 4-5 líneas máximo
  - Usa ÚNICAMENTE los datos proporcionados, NO inventes información
  - Tono informativo y directo, sin ser demasiado familiar
  - Menciona solo temperaturas, vientos y actividad de peces según los datos reales
  - Usa íconos de peces: 🐟🐟🐟 (excelente), 🐟🐟 (buena), 🐟 (regular)
  - NO hagas predicciones ni des consejos, solo resume los datos

  ✅ **EJEMPLOS DE INICIO CORRECTO:**
  - "Temperaturas entre 15-20°C con vientos de 8-12 km/h..."
  - "Esta semana presenta condiciones estables con..."
  - "El embalse al 85% registra temperaturas de..."
  - "Condiciones meteorológicas variables con..."

  ❌ **NUNCA USES:**
  - "Aquí tienes un resumen..."
  - "Te proporciono la información..."
  - "A continuación encontrarás..."
  - "Basándome en los datos..."
  - "Recomiendo que..."
  - "Será perfecto para..."
  `

    const promptHash = await hashTextToSha256(prompt)

    const cacheQuery = await CacheClient.get(promptHash)
    if (cacheQuery !== null && cacheQuery !== undefined) {
      return cacheQuery
    }

    const { data, error } = await supabase.functions.invoke("Gemini-2-9", {
      body: { prompt },
    })

    if (error) {
      return "No se pudo generar el resumen debido a un error interno."
    }

    const responseText = data?.response || data?.text || ""

    try {
      await savedCache({ token: promptHash, data: responseText })
    } catch {
      // Error de cache no crítico, se ignora
    }

    return responseText
  } catch {
    return "No se pudo generar el resumen debido a un error interno."
  }
}

export const getFavSections = async (
  id: string,
  setFavData: (data: FavSection[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    setIsLoading(true)

    const { data, error } = await supabase.from("favorite_reservoirs").select().eq("user_id", id)

    if (error) {
      console.error("Error fetching favorite sections:", error)
      setFavData([])
      setIsLoading(false)
      return []
    }

    const favorites = data[0]?.favorites || []
    const españa = favorites.filter((embalse: { pais: string }) => embalse.pais === "España")
    const portugal = favorites.filter((embalse: { pais: string }) => embalse.pais === "Portugal")

    const nombresPt = portugal.map((embalse: { embalse: string }) => embalse.embalse?.toLowerCase()).filter(Boolean)

    const nombresEs = españa.map((embalse: { embalse: string }) => embalse.embalse)

    const { data: portugalData, error: portugalError } = await supabase
      .from("portugal_data")
      .select()
      .in("nombre_embalse", nombresPt)

    if (portugalError) {
      console.error("Error fetching Portugal data:", portugalError)
      setFavData([])
      setIsLoading(false)
      return []
    }

    const { data: españaData, error: españaError } = await supabase.rpc("obtener_ultimo_registro_por_embalse", {
      nombres_embalses: nombresEs,
    })

    if (españaError) {
      console.error("Error al llamar RPC:", españaError)
      setFavData([])
      setIsLoading(false)
      return []
    }

    setFavData([...(españaData || []), ...(portugalData || [])])
    setIsLoading(false)
  } catch (error) {
    console.error("Error fetching favorite sections:", error)
    setFavData([])
    setIsLoading(false)
    return []
  }
}

export const LiveDataTest = async (embalse: string) => {
  const { data, error } = await supabase.from("live_data").select().eq("embalse", embalse)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const useLiveData = (embalse: string, isPortugal: boolean) => {
  return useQuery({
    queryKey: ["liveData", embalse],
    queryFn: ({ queryKey }) => {
      const [_key, embalse] = queryKey
      return LiveDataTest(embalse)
    },
    enabled: !isPortugal,
  })
}

export const HistoricalDataTest = async (embalse: string) => {
  const { data, error } = await supabase
    .from("embalses2025")
    .select()
    .eq("embalse", embalse)
    .order("fecha", { ascending: false })

  if (error) {
    return new Error(error.message)
  }
  return data
}

export const useHistoricalData = (embalse: string, isPortugal: boolean) => {
  return useQuery({
    queryKey: ["historicalData", embalse],
    queryFn: ({ queryKey }) => {
      const [_key, embalse] = queryKey
      return HistoricalDataTest(embalse)
    },
    enabled: !isPortugal,
  })
}
export const useHistoricalDataCatch = (embalse: string, step: number) => {
  return useQuery({
    queryKey: ["historicalData", embalse],
    queryFn: ({ queryKey }) => {
      const [_key, embalse] = queryKey
      return HistoricalDataTest(embalse)
    },
    enabled: step === 3 && Boolean(embalse?.trim()),
  })
}

export const PortugalDataTest = async (embalse: string) => {
  const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse
  const embalseLower = typeof embalseStr === "string" ? embalseStr.toLowerCase() : embalseStr
  const { data, error } = await supabase.from("portugal_data").select().eq("nombre_embalse", embalseLower)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const usePortugalData = (embalse: string, isPortugal: boolean) => {
  return useQuery({
    queryKey: ["portugalData", embalse],
    queryFn: ({ queryKey }) => {
      const [_key, embalse] = queryKey
      return PortugalDataTest(embalse)
    },
    enabled: isPortugal,
  })
}

export const getFavSectionsT = async (id: string) => {
  try {
    const { data, error } = await supabase.from("favorite_reservoirs").select().eq("user_id", id)

    if (error) {
      throw new Error(error.message)
    }

    const favorites = data[0]?.favorites || []
    const españa = favorites.filter((embalse: { pais: string }) => embalse.pais === "España")
    const portugal = favorites.filter((embalse: { pais: string }) => embalse.pais === "Portugal")

    const nombresPt = portugal.map((embalse: { embalse: string }) => embalse.embalse?.toLowerCase()).filter(Boolean)

    const nombresEs = españa.map((embalse: { embalse: string }) => embalse.embalse)

    const { data: portugalData, error: portugalError } = await supabase
      .from("portugal_data")
      .select()
      .in("nombre_embalse", nombresPt)

    if (portugalError) {
      throw new Error(portugalError.message)
    }

    const { data: españaData, error: españaError } = await supabase.rpc("obtener_ultimo_registro_por_embalse", {
      nombres_embalses: nombresEs,
    })

    if (españaError) {
      throw new Error(españaError.message)
    }

    const finalData = [...(españaData || []), ...(portugalData || [])]

    return finalData
  } catch (error) {
    console.error("Error fetching favorite sections:", error)
    return []
  }
}

export const useFavSection = (id: string) => {
  return useQuery({
    queryKey: ["favoriteSection", id],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey
      return getFavSectionsT(id)
    },
    enabled: !!id,
  })
}

export const AutoComplete = async (place: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&countrycodes=es,pt&format=json&limit=10`,
    {
      headers: {
        "User-Agent": "AcuaNet-App/1.0.0",
      },
    }
  )

  if (!res.ok) {
    console.error("Error fetching place data:", res.statusText, "Status:", res.status)
    throw new Error(`Failed to fetch place data: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  return data
}

export const useNominatim = (place: string) => {
  return useQuery({
    queryKey: ["nominatim", place],
    queryFn: ({ queryKey }) => {
      const [_key, place] = queryKey
      return AutoComplete(place)
    },
    enabled: place.length > 2,
  })
}

export const insertCatchReport = async (
  catchData: Omit<catchReport, "images">,
  uuid: string,
  images: string[],
  emb_data?: EmbalseDataHistorical
) => {
  const catchUuid = uuidv4()
  const filePath = `${uuid}/catch_reports/${catchUuid}/`
  const uploadedImages: string[] = []

  for (let i = 0; i < images.length; i++) {
    const imageUri = images[i]

    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 800 } }], {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      })

      const fileName = `image_${i}.jpg`
      const fullPath = `${filePath}${fileName}`

      const base64Data = manipulatedImage.base64!
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let j = 0; j < byteCharacters.length; j++) {
        byteNumbers[j] = byteCharacters.charCodeAt(j)
      }
      const byteArray = new Uint8Array(byteNumbers)

      const { error } = await supabase.storage.from("accounts").upload(fullPath, byteArray, {
        contentType: "image/jpeg",
        upsert: false,
      })

      if (error) {
        throw new Error(`Error uploading image ${i}: ${error.message}`)
      }

      uploadedImages.push(fullPath)
    } catch (uploadError) {
      console.error(`Error uploading image ${i}:`, uploadError)
      throw uploadError
    }
  }

  console.log("Datos a insertar:", {
    catch_id: catchUuid,
    user_id: uuid,
    embalse: catchData.embalse,
    fecha: catchData.date,
    especie: catchData.especie,
    peso: catchData.peso ? parseFloat(catchData.peso) : null,
    profundidad: catchData.profundidad,
    situacion: catchData.situacion,
    tecnica: catchData.tecnica,
    temperatura: catchData.temperatura ? parseFloat(catchData.temperatura) : null,
    comentarios: catchData.comentarios,
    imagenes: uploadedImages,
    created_at: new Date().toISOString(),
    emb_data: emb_data,
    lat: catchData.lat,
    lng: catchData.lng,
  })

  const { data, error } = await supabase.from("catch_reports").insert({
    catch_id: catchUuid,
    user_id: uuid,
    embalse: catchData.embalse,
    fecha: catchData.date,
    especie: catchData.especie,
    peso: catchData.peso ? parseFloat(catchData.peso) : null,
    profundidad: catchData.profundidad,
    situacion: catchData.situacion,
    tecnica: catchData.tecnica,
    temperatura: catchData.temperatura ? parseFloat(catchData.temperatura) : null,
    comentarios: catchData.comentarios,
    imagenes: uploadedImages,
    created_at: new Date().toISOString(),
    emb_data: emb_data,
    lat: catchData.lat,
    lng: catchData.lng,
  })

  if (error) {
    console.error("Error inserting catch report:", error)
    throw new Error(error.message)
  }

  return { uploadedImages, reportId: catchUuid }
}

export const useInsertCatchReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      catchData,
      uuid,
      images,
      emb_data,
    }: {
      catchData: Omit<catchReport, "images">
      uuid: string
      images: string[]
      emb_data?: EmbalseDataHistorical
    }) => {
      return insertCatchReport(catchData, uuid, images, emb_data)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userCatchReports", variables.uuid] })
    },
  })
}

export const getUserCatchReports = async (userId: string): Promise<CatchReportDB[]> => {
  const { data, error } = await supabase
    .from("catch_reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user catch reports:", error)
    throw new Error(error.message)
  }

  return data || []
}

export const useUserCatchReports = (userId: string) => {
  return useQuery<CatchReportDB[], Error>({
    queryKey: ["userCatchReports", userId],
    queryFn: ({ queryKey }) => {
      const [_key, userId] = queryKey as [string, string]
      return getUserCatchReports(userId)
    },
    enabled: !!userId,
  })
}
