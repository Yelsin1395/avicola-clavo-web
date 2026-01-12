import { CurrencyCode, CurrencySymbol } from '../interfaces/currency.interface';
import { ProductType } from '../interfaces/productType.interface';

export interface Product {
  id?: string;
  storeId: string;
  imageUrl?: string;
  name: string;
  type: ProductType;
  brandOrProvider: string;
  description: string;
  currencyCode: CurrencyCode;
  currencySymbol: CurrencySymbol;
  basePrice: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
