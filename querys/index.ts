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
