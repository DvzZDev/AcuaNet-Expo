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
    const prompt = `
  Genera un resumen breve y natural sobre las condiciones de pesca en los próximos días basándote en los siguientes datos. Usa frases fluidas y útiles, sin listas ni formato estructurado.

  📊 **Datos:**
  - **Clima:** ${JSON.stringify(weather, null, 2)}
  - **Embalse:** ${embalse ? JSON.stringify(embalse.embalse, null, 2) : "N/A"}
  - **Actividad de los peces:** ${JSON.stringify(fish_activity, null, 2)}

  🔹 **Ejemplo de Respuesta Esperada:**
  "Este fin de semana se esperan temperaturas alrededor de los 20°C. El sábado habrá un pico de actividad con vientos fuertes superando los 28 km/h a las 18:00. El domingo será más estable con actividad media. El embalse está alto, al 89%, así que tenlo en cuenta para acceder a ciertas zonas."
  `

    const promptHash = await hashTextToSha256(prompt)

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
