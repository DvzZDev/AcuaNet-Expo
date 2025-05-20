export interface EmbalseDataHistorical {
  capacidad_total: number;
  cuenca: string;
  embalse: string;
  fecha: string;
  id: string;
  porcentaje: number;
  volumen_actual: number;
}

export interface EmbalseDataLive {
  cota: number;
  embalse: string;
  id: string;
  porcentaje: number;
  timestamp: string;
  volumen: number;
}

export interface WeatherData {
    queryCost:         number;
    latitude:          number;
    longitude:         number;
    resolvedAddress:   string;
    address:           string;
    timezone:          string;
    tzoffset:          number;
    description:       string;
    days:              Day[];
    currentConditions: CurrentConditions;
}

export interface CurrentConditions {
    datetime:       string;
    datetimeEpoch:  number;
    temp:           number;
    feelslike:      number;
    humidity:       number;
    precip:         number;
    precipprob:     number;
    windspeed:      number;
    winddir:        number;
    pressure:       number;
    visibility:     number;
    solarradiation: number;
    uvindex:        number;
    severerisk:     number;
    conditions:     Conditions;
    icon:           Icon;
    source:         Source;
    sunrise?:       string;
    sunset?:        string;
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
}

export interface Day {
    datetime:       Date;
    datetimeEpoch:  number;
    tempmin:        number;
    temp:           number;
    feelslike:      number;
    humidity:       number;
    precip:         number;
    precipprob:     number;
    windspeed:      number;
    winddir:        number;
    pressure:       number;
    visibility:     number;
    solarradiation: number;
    uvindex:        number;
    severerisk:     number;
    windspeedmax:   number;
    windspeedmean:  number;
    windspeedmin:   number;
    sunrise:        string;
    sunset:         string;
    conditions:     Conditions;
    description:    Description;
    icon:           Icon;
    source:         Source;
    normal:         Normal;
    hours:          CurrentConditions[];
}

export enum Description {
    ClearConditionsThroughoutTheDay = "Clear conditions throughout the day.",
    PartlyCloudyThroughoutTheDay = "Partly cloudy throughout the day.",
}

export interface Normal {
    tempmin:   number[];
    feelslike: number[];
    precip:    number[];
    humidity:  number[];
    windspeed: number[];
    winddir:   number[];
}
