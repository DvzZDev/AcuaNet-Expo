import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { TouchableOpacity, View } from "react-native"
import { useState, useEffect } from "react"
import { supabase } from "lib/supabase"

export default function FavButton({ userId, embalse, pais }: { userId: string; embalse: string; pais: string }) {
  const [isFavourite, setIsFavourite] = useState(false)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const { data: currentData, error: fetchError } = await supabase
        .from("favorite_reservoirs")
        .select("favorites")
        .eq("user_id", userId)
        .single()

      if (!fetchError && currentData && Array.isArray(currentData.favorites)) {
        const isCurrentlyFavorite = currentData.favorites.some(
          (fav: any) =>
            (typeof fav === "string" && fav === embalse) || (typeof fav === "object" && fav.embalse === embalse)
        )
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
        updatedFavorites = currentData.favorites.filter((fav: any) => {
          if (typeof fav === "string") {
            return fav !== embalse
          } else if (typeof fav === "object" && fav.embalse) {
            return fav.embalse !== embalse
          }
          return true
        })
      } else {
        // Agregar el embalse con su país y fecha actual
        const newFavorite = {
          embalse,
          pais,
          fechaAñadido: new Date().toISOString(),
        }
        updatedFavorites = [...currentData.favorites, newFavorite]

        const uniqueFavorites = []
        const seenEmbalses = new Set()

        for (const fav of updatedFavorites) {
          const embalseKey = typeof fav === "string" ? fav : fav.embalse
          if (!seenEmbalses.has(embalseKey)) {
            seenEmbalses.add(embalseKey)
            if (typeof fav === "string") {
              uniqueFavorites.push({
                embalse: fav,
                pais: "N/D",
                fechaAñadido: new Date().toISOString(),
              })
            } else {
              uniqueFavorites.push(fav)
            }
          }
        }

        updatedFavorites = uniqueFavorites
      }
    } else {
      if (!isFavourite) {
        updatedFavorites = [
          {
            embalse,
            pais,
            fechaAñadido: new Date().toISOString(),
          },
        ]
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
