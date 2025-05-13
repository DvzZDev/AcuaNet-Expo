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
