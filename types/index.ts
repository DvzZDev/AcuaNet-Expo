export interface EmbalseDataHistorical {
  capacidad_total: number
  cuenca: string
  embalse: string
  fecha: string
  id: string
  porcentaje: number
  volumen_actual: number
}

export interface Embalses {
  fecha: Date | null
  embalse: string
  cuenca: string | null
  volumen_actual: number | null
  porcentaje: number | null
  variacion_ultima_semana?: number | null
  variacion_ultima_semanapor?: number | null
  capacidad_total: number | null
  lat?: number | null
  lon?: number | null
  pais?: string | null
}

export interface EmbalseDataLive {
  cota: number
  embalse: string
  id: string
  porcentaje: number
  timestamp: string
  volumen: number
}

export interface WeatherData {
  queryCost: number
  latitude: number
  longitude: number
  resolvedAddress: string
  address: string
  timezone: string
  tzoffset: number
  days: Day[]
  alerts: any[]
  currentConditions: CurrentConditions
}

export interface CurrentConditions {
  datetime: string
  datetimeEpoch: number
  temp: number
  feelslike: number
  humidity: number
  dew: number
  precip: number
  precipprob: number
  snow: number
  snowdepth: number
  preciptype: string[] | null
  windgust: number
  windspeed: number
  winddir: number
  pressure: number
  visibility: number
  cloudcover: number
  solarradiation: number
  solarenergy: number
  uvindex: number
  severerisk: number
  conditions: Conditions
  icon: Icon
  source: Source
  sunrise?: string
  sunset?: string
  moonphase?: number
}

export enum Conditions {
  Clear = "Clear",
  Overcast = "Overcast",
  PartiallyCloudy = "Partially cloudy",
}

export enum Icon {
  ClearDay = "clear-day",
  ClearNight = "clear-night",
  Cloudy = "cloudy",
  PartlyCloudyDay = "partly-cloudy-day",
  PartlyCloudyNight = "partly-cloudy-night",
}

export enum Source {
  Fcst = "fcst",
  Stats = "stats",
}

export interface Day {
  datetime: Date
  datetimeEpoch: number
  tempmax: number
  tempmin: number
  temp: number
  feelslikemax: number
  feelslikemin: number
  feelslike: number
  dew: number
  humidity: number
  precip: number
  precipprob: number
  precipcover: number
  preciptype: string[] | null
  snow: number | null
  snowdepth: number
  windgust: number
  windspeed: number
  winddir: number
  pressure: number
  cloudcover: number
  visibility: number
  solarradiation: number | null
  solarenergy: number | null
  uvindex: number | null
  severerisk?: number
  windspeedmax: number
  windspeedmean: number
  windspeedmin: number
  sunrise: string
  sunset: string
  moonphase: number
  conditions: Conditions
  description: string
  icon: Icon
  source: Source
  normal: { [key: string]: number[] }
  hours?: CurrentConditions[]
}

export interface EmbalseCoordinate {
  embalse: string
  lat: number | null
  long: number | null
}

export type EmbalseCoordinates = EmbalseCoordinate[]
