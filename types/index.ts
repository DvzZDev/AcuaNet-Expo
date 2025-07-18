import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

// Stack Navigator Parameter Types
export type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
  RecoverPassword: undefined
  Account: undefined
  Tabs: undefined
  Search: undefined
  ConfirmEmail: undefined
  Embalse: { embalse: string }
  CatchReport: {
    catchReportId?: string
  }
  Gallery: undefined
  Welcome: undefined
}

export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>

export interface EmbalseDataHistorical {
  capacidad_total: number
  cuenca: string
  embalse: string
  fecha: string
  id: string
  porcentaje: number
  volumen_actual: number
}

export interface EmbalseDataPortugal {
  agua_embalsada: number
  agua_embalsadapor: number
  capacidad_total: number
  fecha_modificacion: string
  nombre_cuenca: string
  nombre_embalse: string
  pais: string
  variacion_ultima_semana: number
  variacion_ultima_semanapor: number
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

export interface FavSection {
  embalse: string
  pais: string
  fechaAñadido?: string
  id?: number
  lat?: number
  lon?: number
  // Portuguese reservoirs specific fields
  agua_embalsada?: number
  agua_embalsadapor?: number
  capacidad_total?: number
  fecha_modificacion?: string
  nombre_cuenca?: string
  nombre_embalse?: string
  variacion_ultima_semana?: number
  variacion_ultima_semanapor?: number
  // Spanish reservoirs specific fields
  cuenca?: string
  fecha?: string
  porcentaje?: number
  volumen_actual?: number
}

export interface catchReport {
  embalse: string
  epoca: string
  date: string
  especie: string
  peso: string | null
  profundidad: string | null
  situacion: string | null
  tecnica: string | null
  temperatura: string | null
  comentarios: string | null
  images: string[]
  emb_data?: EmbalseDataHistorical
  lat?: number
  lng?: number
}

export interface CatchReportDB {
  catch_id: string
  user_id: string
  embalse: string
  fecha: string
  especie: string
  peso: number | null
  profundidad: string | null
  situacion: string | null
  tecnica: string | null
  temperatura: number | null
  comentarios: string | null
  imagenes: string[]
  created_at: string
  emb_data?: EmbalseDataHistorical
  lat?: number
  lng?: number
  weather?: WeatherData
  estacion?: string
}

export type UserCatchReport = {
  catch_id: string
}

export type TabStackParamList = {
  Home: undefined
  Account: undefined
  CatchMap: { catchReportId?: string }
}

export interface UserData {
  avatar: string
  email: string
  id: string
  lastname: string
  name: string
}
