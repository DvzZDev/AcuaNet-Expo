import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { TouchableOpacity, View } from "react-native"
import { useState, useEffect } from "react"
import { supabase } from "lib/supabase"

export default function FavButton({ userId, embalse }: { userId: string; embalse: string }) {
  console.log("FavButton rendered with userId:", userId)
  const [isFavourite, setIsFavourite] = useState(false)

  // Check if embalse is already in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const { data: currentData, error: fetchError } = await supabase
        .from("favorite_reservoirs")
        .select("favorites")
        .eq("user_id", userId)
        .single()

      if (!fetchError && currentData && Array.isArray(currentData.favorites)) {
        const isCurrentlyFavorite = currentData.favorites.includes(embalse)
        setIsFavourite(isCurrentlyFavorite)
      }
    }

    if (userId && embalse) {
      checkFavoriteStatus()
    }
  }, [userId, embalse])

  const toggleFav = async () => {
    const { data: currentData, error: fetchError } = await supabase
      .from("favorite_reservoirs")
      .select("favorites")
      .eq("user_id", userId)
      .single()

    let updatedFavorites = []

    if (!fetchError && currentData && Array.isArray(currentData.favorites)) {
      if (isFavourite) {
        updatedFavorites = currentData.favorites.filter((fav) => fav !== embalse)
      } else {
        updatedFavorites = [...currentData.favorites, embalse]
        updatedFavorites = [...new Set(updatedFavorites)]
      }
    } else {
      if (!isFavourite) {
        updatedFavorites = [embalse]
      }
    }

    const { data, error } = await supabase.from("favorite_reservoirs").upsert([
      {
        user_id: userId,
        favorites: updatedFavorites,
      },
    ])

    if (error) {
      console.error("Error updating favourites:", error)
    } else {
      console.log("Updated favourites:", data)
      setIsFavourite(!isFavourite)
    }
  }
  return (
    <View className="rounded-2xl bg-red-200 p-3 ">
      <TouchableOpacity onPress={toggleFav}>
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={30}
          fill={isFavourite ? "red" : "white"}
          color={isFavourite ? "red" : "white"}
        />
      </TouchableOpacity>
    </View>
  )
}
