const ESPECIES_PESCA = [
  { name: "Black Bass", image: require("../assets/bass.png") },
  { name: "Lucio", image: require("../assets/lucio.png") },
  { name: "Lucio Perca", image: require("../assets/lucioperca.png") },
  { name: "Perca", image: require("../assets/perca.png") },
  { name: "Carpa", image: require("../assets/carpa.png") },
  { name: "Barbo", image: require("../assets/barbo.png") },
  { name: "Siluro", image: require("../assets/siluro.png") },
]

/**
 * Devuelve la imagen correspondiente al nombre de la especie de pesca
 * @param nombreEspecie - El nombre de la especie de pesca
 * @returns La imagen de la especie o null si no se encuentra
 */
export function getFishImage(nombreEspecie: string) {
  const especie = ESPECIES_PESCA.find((pez) => pez.name.toLowerCase() === nombreEspecie.toLowerCase())

  return especie ? especie.image : null
}

/**
 * Devuelve todas las especies de pesca disponibles
 * @returns Array con todas las especies de pesca
 */
export function getAllFishSpecies() {
  return ESPECIES_PESCA
}

/**
 * Devuelve solo los nombres de las especies de pesca
 * @returns Array con los nombres de las especies
 */
export function getFishSpeciesNames() {
  return ESPECIES_PESCA.map((especie) => especie.name)
}
