import type { Embalses, EmbalseDataHistorical } from "types"

interface WeekVariation {
  lastWeek: number
  pctDifference: number
}

interface CapacityData {
  vol: number
  por: number
}

export function LastWeekVariation(embalses: EmbalseDataHistorical[]): WeekVariation {
  const lastWeek = (embalses[0]?.volumen_actual ?? 0) - (embalses[1]?.volumen_actual ?? 0)
  const pctDifference = Number(((embalses[0]?.porcentaje ?? 0) - (embalses[1]?.porcentaje ?? 0)).toFixed(2))
  return { lastWeek, pctDifference }
}

export function getSameWeekLastYearCapacity(embalses: EmbalseDataHistorical[]): CapacityData | null {
  if (!embalses?.length) return null

  const currentDate = new Date(embalses[0].fecha ?? new Date())
  const lastYearDate = new Date(currentDate)
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1)

  let closest = embalses[0]
  let minDiff = Math.abs(new Date(closest.fecha ?? new Date()).getTime() - lastYearDate.getTime())

  for (const embalse of embalses) {
    const diff = embalse.fecha ? Math.abs(new Date(embalse.fecha).getTime() - lastYearDate.getTime()) : Number.MAX_VALUE
    if (diff < minDiff) {
      minDiff = diff
      closest = embalse
    }
  }

  return {
    vol: Number(closest.volumen_actual),
    por: Number(closest.porcentaje),
  }
}

export function getClosestByDate(embalses: Embalses[], targetDate: Date): Embalses | null {
  if (!embalses?.length) {
    return null
  }

  let closest = embalses[0]
  let minDiff = Math.abs(new Date(closest.fecha ?? 0).getTime() - targetDate.getTime())

  for (const embalse of embalses) {
    const diff = embalse.fecha ? Math.abs(new Date(embalse.fecha).getTime() - targetDate.getTime()) : Number.MAX_VALUE
    if (diff < minDiff) {
      minDiff = diff
      closest = embalse
    }
  }
  return closest
}

export function getSameWeekLast10YearsAverage(embalses: EmbalseDataHistorical[]): number | null {
  if (!embalses?.length) return null

  const currentDate = new Date(embalses[0].fecha ?? new Date())
  const capacities: number[] = []

  for (let i = 1; i <= 10; i++) {
    const yearDate = new Date(currentDate)
    yearDate.setFullYear(yearDate.getFullYear() - i)
    const embalsesWithDate: Embalses[] = embalses.map((e) => ({
      ...e,
      fecha: e.fecha ? new Date(e.fecha) : null,
    }))
    const found = getClosestByDate(embalsesWithDate, yearDate)
    if (found?.volumen_actual) {
      capacities.push(Number(found.volumen_actual))
    }
  }

  if (!capacities.length) return null
  const total = capacities.reduce((acc, val) => acc + val, 0)
  return total / capacities.length
}

export function getSameWeekLast10YearsAveragePercentage(embalses: EmbalseDataHistorical[]): number | null {
  if (!embalses?.length) return null

  const currentDate = new Date(embalses[0].fecha ?? new Date())
  const percentages: number[] = []

  for (let i = 1; i <= 10; i++) {
    const yearDate = new Date(currentDate)
    yearDate.setFullYear(yearDate.getFullYear() - i)
    const embalsesWithDate: Embalses[] = embalses.map((e) => ({
      ...e,
      fecha: e.fecha ? new Date(e.fecha) : null,
    }))
    const found = getClosestByDate(embalsesWithDate, yearDate)
    if (found?.porcentaje) {
      percentages.push(Number(found.porcentaje))
    }
  }

  if (!percentages.length) return null
  const total = percentages.reduce((acc, val) => acc + val, 0)
  return Number((total / percentages.length).toFixed(2))
}
