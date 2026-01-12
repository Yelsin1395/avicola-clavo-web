export enum ProductType {
  TANGIBLE = 'TANGIBLE',
  INTANGIBLE = 'INTANGIBLE',
}

export type ProductTypeString = keyof typeof ProductType;
