import { decode } from "base64-arraybuffer"
import { supabase } from "./supabase"

/**
 * Interfaz para los parámetros de la función uploadImage
 */
interface UploadImageParams {
  imageBase64: string
  userId: string
  bucketName: string
  fileName?: string
  fileExtension?: string
}

/**
 * Interfaz para el resultado de la función uploadImage
 */
interface UploadImageResult {
  success: boolean
  data?: {
    imageUrl: string
    path: string
  }
  error?: string
}

/**
 * Sube una imagen a Supabase Storage y actualiza el perfil del usuario
 * @param params Parámetros para subir la imagen
 * @returns Resultado de la operación
 */
export const uploadImage = async ({
  imageBase64,
  userId,
  bucketName,
  fileName = "Avatar",
  fileExtension = "png",
}: UploadImageParams): Promise<UploadImageResult> => {
  try {
    if (!imageBase64) {
      return { success: false, error: "No hay imagen seleccionada." }
    }

    if (!userId) {
      return { success: false, error: "Usuario no autenticado." }
    }

    const finalFileName = `${fileName}.${fileExtension}`
    const filePath = `${userId}/${finalFileName}`

    // Primero intentamos eliminar la imagen anterior si existe
    try {
      await supabase.storage.from(bucketName).remove([`${userId}/${finalFileName}`])
      console.log("Archivo anterior eliminado o no existía")
    } catch (deleteError) {
      // Si hay un error al eliminar, simplemente continuamos con el upsert
      console.log("No se pudo eliminar la imagen anterior, continuando con el upsert:", deleteError)
    }

    // Subimos la nueva imagen
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, decode(imageBase64), {
      contentType: `image/${fileExtension}`,
      upsert: true, // Aseguramos que se sobrescriba si ya existe
    })

    if (error) {
      return { success: false, error: `Error al subir la imagen: ${error.message}` }
    }

    console.log("Imagen subida exitosamente:", data)

    // Construimos y devolvemos la URL pública de la imagen
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${userId}/${finalFileName}`)
    const imageUrl = publicUrlData.publicUrl

    return { success: true, data: { imageUrl, path: filePath } }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: "Error inesperado al subir la imagen." }
  }
}
