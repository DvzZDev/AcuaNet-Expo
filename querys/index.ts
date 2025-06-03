import CacheClient from "cache"
import hashTextToSha256 from "lib/HashText"
import { supabase } from "lib/supabase"

export const HistoricalData = async (
  embalse: string | string[],
  codedEmbalse: string,
  setHData: (data: any) => void
) => {
  try {
    const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse
    const { data, error } = await supabase
      .from("embalses2025")
      .select()
      .eq("embalse", typeof embalseStr === "string" ? codedEmbalse : embalseStr)
      .order("fecha", { ascending: false })

    if (error) {
      console.error("Error fetching historical data:", error)
      setHData([])
      return
    }

    setHData(data || [])
  } catch (err) {
    console.error("Exception in HistoricalData:", err)
    setHData([])
  }
}

export const LiveData = async (embalse: string | string[], codedEmbalse: string, setLiveData: (data: any) => void) => {
  try {
    const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse
    const { data, error } = await supabase
      .from("live_data")
      .select()
      .eq("embalse", typeof embalseStr === "string" ? codedEmbalse : embalseStr)

    if (error) {
      console.error("Error fetching live data:", error)
      setLiveData([])
      return
    }

    setLiveData(data || [])
  } catch (err) {
    console.error("Exception in LiveData:", err)
    setLiveData([])
  }
}

export const CheckCoords = async (embalse: string | string[], setCheckCoords: (data: any) => void) => {
  try {
    const embalseStr = Array.isArray(embalse) ? embalse[0] : embalse

    const { data, error } = await supabase
      .from("embalses_coords")
      .select()
      .eq("embalse", typeof embalseStr === "string" ? embalse : embalseStr)
      .limit(1)

    if (error) {
      console.error("Error fetching coords:", error)
      setCheckCoords([])
      return
    }

    setCheckCoords(data || [])
  } catch (err) {
    console.error("Exception in CheckCoords:", err)
    setCheckCoords([])
  }
}

async function savedCache({ token, data }: { token: string; data: string }) {
  try {
    await CacheClient.set(token, data, { EX: 3600 })
  } catch (error) {
    console.error("Cache save error:", error)
  }
}

// Función para normalizar objetos y asegurar un JSON determinístico
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
  console.log(embalse)
  try {
    // Normalizar los datos para asegurar un hash consistente
    const normalizedWeather = normalizeForCache(weather)
    const normalizedFishActivity = normalizeForCache(fish_activity)

    const prompt = `
  Genera un resumen breve y natural sobre las condiciones de pesca para los próximos 7 días basándote en los siguientes datos. Proporciona información clara y concisa para lectura rápida.

  📊 **Datos:**
  - **Embalse:** ${embalse.embalse.name}
  - **Nivel del embalse:** ${embalse.embalse.nivel} m
  - **Porcentaje de capacidad:** ${embalse.embalse.porcentaje}%
  - **Pronóstico meteorológico (7 días):** ${JSON.stringify(normalizedWeather, null, 2)}
  - **Actividad lunar y de peces (7 días):** ${JSON.stringify(normalizedFishActivity, null, 2)}

  🎣 **Instrucciones específicas:**
  - No empieces el resumen siempre con la misma frase ni repitas estructuras como "Aquí tienes un resumen de las condiciones de pesca en el embalse de X para los próximos 7 días".
  - Describe las condiciones meteorológicas principales (temperaturas, vientos, precipitaciones)
  - Menciona los días con actividad de peces destacada (🐟🐟🐟 = alta, 🐟🐟 = media, 🐟 = baja)
  - Incluye información sobre el estado del embalse
  - Presenta la información de manera clara y directa, sin dar consejos
  - Usa un tono informativo y natural para lectura rápida

  🔹 **Ejemplo de Respuesta Esperada:**
  "Esta semana las temperaturas oscilarán entre 18-22°C con condiciones mayormente estables. El martes y viernes presentan actividad alta de peces (🐟🐟🐟) coincidiendo con fases lunares favorables. El sábado se esperan vientos de 15 km/h. Habrá precipitaciones leves el miércoles. El embalse se encuentra al 89% de su capacidad."
  `

    const promptHash = await hashTextToSha256(prompt)

    console.log("Prompt hash:", promptHash)

    const cacheQuery = await CacheClient.get(promptHash)
    if (cacheQuery !== null && cacheQuery !== undefined) {
      console.log("Cache hit:", promptHash)
      return cacheQuery
    }

    console.log("Cache miss, calling Gemini function...")
    const { data, error } = await supabase.functions.invoke("Gemini-2-9", {
      body: { prompt },
    })

    if (error) {
      console.error("Error calling Gemini function:", error)
      return "No se pudo generar el resumen debido a un error interno."
    }

    const responseText = data?.response || data?.text || ""

    try {
      await savedCache({ token: promptHash, data: responseText })
      console.log("Cache saved successfully")
    } catch (cacheError) {
      console.log("Error saving to cache:", cacheError)
    }

    return responseText
  } catch (error) {
    console.error("Simple Gemini AI error:", error)
    return "No se pudo generar el resumen debido a un error interno."
  }
}
