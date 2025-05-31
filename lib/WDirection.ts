/**
 * Interface for wind direction data
 */
interface WindDirection {
  short: string
  full: string
  degrees: number
}

/**
 * Wind directions data with Spanish names
 */
const windDirections: WindDirection[] = [
  { short: "N", full: "Norte", degrees: 0 },
  { short: "NNE", full: "Norte-Noreste", degrees: 22.5 },
  { short: "NE", full: "Noreste", degrees: 45 },
  { short: "ENE", full: "Este-Noreste", degrees: 67.5 },
  { short: "E", full: "Este", degrees: 90 },
  { short: "ESE", full: "Este-Sureste", degrees: 112.5 },
  { short: "SE", full: "Sureste", degrees: 135 },
  { short: "SSE", full: "Sur-Sureste", degrees: 157.5 },
  { short: "S", full: "Sur", degrees: 180 },
  { short: "SSO", full: "Sur-Suroeste", degrees: 202.5 },
  { short: "SO", full: "Suroeste", degrees: 225 },
  { short: "OSO", full: "Oeste-Suroeste", degrees: 247.5 },
  { short: "O", full: "Oeste", degrees: 270 },
  { short: "ONO", full: "Oeste-Noroeste", degrees: 292.5 },
  { short: "NO", full: "Noroeste", degrees: 315 },
  { short: "NNO", full: "Norte-Noroeste", degrees: 337.5 },
]

/**
 * Converts wind degrees to wind direction
 * @param degrees - Wind direction in degrees (0-360)
 * @param format - Format type: 'short' for abbreviation (e.g., 'N'), 'full' for complete name (e.g., 'Norte')
 * @returns Wind direction string
 */
export function degreesToWindDirection(degrees: number, format: "short" | "full" = "short"): string {
  // Normalize degrees to 0-360 range
  const normalizedDegrees = ((degrees % 360) + 360) % 360

  // Calculate the closest direction
  // Each direction covers 22.5 degrees (360/16)
  const index = Math.round(normalizedDegrees / 22.5) % 16

  return windDirections[index][format]
}

/**
 * Gets detailed wind direction information
 * @param degrees - Wind direction in degrees (0-360)
 * @returns WindDirection object with short, full, and exact degrees
 */
export function getWindDirectionInfo(degrees: number): WindDirection & { inputDegrees: number } {
  const normalizedDegrees = ((degrees % 360) + 360) % 360
  const index = Math.round(normalizedDegrees / 22.5) % 16

  return {
    ...windDirections[index],
    inputDegrees: normalizedDegrees,
  }
}

/**
 * Converts wind direction name to degrees
 * @param direction - Wind direction name (short or full format)
 * @returns Degrees value or null if direction not found
 */
export function windDirectionToDegrees(direction: string): number | null {
  const normalizedDirection = direction.toLowerCase().trim()

  const found = windDirections.find(
    (wd) => wd.short.toLowerCase() === normalizedDirection || wd.full.toLowerCase() === normalizedDirection
  )

  return found ? found.degrees : null
}

/**
 * Gets all available wind directions
 * @returns Array of all wind directions
 */
export function getAllWindDirections(): WindDirection[] {
  return [...windDirections]
}
