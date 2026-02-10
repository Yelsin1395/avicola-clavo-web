export const UnitsMeasurementMap = {
  // Peso
  KILOGRAMO: 'KG',
  GRAMO: 'GR',
  LIBRA: 'LB',

  // Capacidad / Densidad
  AVES_POR_M2: 'AVES/M2',
  AVES_POR_M3: 'AVES/M3',

  // Conteo Individual y Agrupado
  UNIDAD: 'UND',
  DECENA: 'DEC',
  DOCENA: 'DOC',
  CUARTO_CENTENA: '1/4_CEN',
  MEDIO_CENTENA: '1/2_CEN',
  CENTENA: 'CEN',
  CUARTO_MILLAR: '1/4_MIL',
  MEDIO_MILLAR: '1/2_MIL',
  MILLAR: 'MIL',

  // Empaque y Logística
  CAJA: 'CJA',
  BOLSA: 'BLS',
  BANDEJA: 'BDJ',
  FARDO: 'FDO',
  PAQUETE: 'PQT',
};

export const UnitsMeasurementNames = Object.keys(UnitsMeasurementMap) as Array<
  keyof typeof UnitsMeasurementMap
>;

export type UnitsMeasurementName = keyof typeof UnitsMeasurementMap;
export type UnitsMeasurementCode = (typeof UnitsMeasurementMap)[UnitsMeasurementName];
