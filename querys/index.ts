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
      setHData([])
      return
    }

    setHData(data || [])
  } catch (err) {
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
      setLiveData([])
      return
    }

    setLiveData(data || [])
  } catch (err) {
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
      setCheckCoords([])
      return
    }

    setCheckCoords(data || [])
  } catch (err) {
    setCheckCoords([])
  }
}

async function savedCache({ token, data }: { token: string; data: string }) {
  try {
    await CacheClient.set(token, data, { EX: 3600 })
  } catch (error) {}
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
  try {
    // Normalizar los datos para asegurar un hash consistente
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
