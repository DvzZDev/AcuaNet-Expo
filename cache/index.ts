import AsyncStorage from "@react-native-async-storage/async-storage"

class CacheClient {
  static async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
    try {
      const expiresIn = options?.EX ? options.EX * 1000 : 12 * 60 * 60 * 1000 // 12 hours in ms
      const cacheData = {
        value,
        timestamp: Date.now(),
        expiresIn,
      }
      await AsyncStorage.setItem(`cache:${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.error("Cache set error:", error)
      throw error
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      const cached = await AsyncStorage.getItem(`cache:${key}`)
      if (!cached) return null

      const cacheData = JSON.parse(cached)

      if (cacheData.expiresIn && Date.now() - cacheData.timestamp > cacheData.expiresIn) {
        await AsyncStorage.removeItem(`cache:${key}`)
        return null
      }

      return cacheData.value
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter((key) => key.startsWith("cache:"))
      await AsyncStorage.multiRemove(cacheKeys)
    } catch (error) {
      console.error("Cache clear error:", error)
    }
  }
}

export default CacheClient
