export enum CatalogCode {
  SCHEMA_VALIDATION_FAILED = 'SCHEMA_VALIDATION_FAILED',
  ERROR_AUTH_PASSWORD_INVALID = 'ERROR_AUTH_PASSWORD_INVALID',
  ERROR_AUTH_STORE_NOT_EXIST = 'ERROR_AUTH_STORE_NOT_EXIST',
  ERR_TERMS_AND_CONDITIONS = 'ERR_TERMS_AND_CONDITIONS',
  ERR_COMPANY_NOT_FOUND_SUNAT = 'ERR_COMPANY_NOT_FOUND_SUNAT',
  ERR_STORE_LEGAL_REPRESENTATIVE_INVALID = 'ERR_STORE_LEGAL_REPRESENTATIVE_INVALID',
}

type CatalogStrings = keyof typeof CatalogCode;

export function getErrorDescription(key: CatalogStrings | any) {
  if (key === CatalogCode.SCHEMA_VALIDATION_FAILED) {
    return '¡Ups! Algo no está bien con la información que ingresaste';
  }

  if (key === CatalogCode.ERROR_AUTH_PASSWORD_INVALID) {
    return 'Revisa los campos dni y/o contraseña incorrecto';
  }

  if (key === CatalogCode.ERROR_AUTH_STORE_NOT_EXIST) {
    return 'Parece que aún no te haz registrado, <b>crea tu cuenta negocio</b>';
  }

  if (key === CatalogCode.ERR_TERMS_AND_CONDITIONS) {
    return '¡Un momento! Para crear tu tienda en Caserita, primero debes <b>aceptar nuestros Términos y Condiciones</b>';
  }

  if (key === CatalogCode.ERR_COMPANY_NOT_FOUND_SUNAT) {
    return 'Al parecer el negocio no esta registrado en SUNAT';
  }

  if (key === CatalogCode.ERR_STORE_LEGAL_REPRESENTATIVE_INVALID) {
    return 'El representate legal <b>no corresponde con el negocio</b>';
  }

  return 'Algo no salió como esperábamos';
}
