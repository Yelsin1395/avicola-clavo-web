import { FormControl } from '@angular/forms';
import { ProductType, ProductTypeString } from '../interfaces/productType.interface';
import { CurrencyCode, CurrencySymbol } from '../interfaces/currency.interface';

export interface CreateProductRequest {
  imageUrl?: string;
  name: string;
  type: ProductType;
  brandOrProvider: string;
  description: string;
  currencyCode: CurrencyCode;
  currencySymbol: CurrencySymbol;
  basePrice: number;
}

export interface CreateProductForm {
  name: FormControl<string>;
  type: FormControl<ProductTypeString | string>;
  brandOrProvider: FormControl<string>;
  description: FormControl<string>;
  currencyCode: FormControl<CurrencyCode | string>;
  basePrice: FormControl<number>;
}

export interface SearchProductRequest {
  name?: string;
  take: number;
  skip: number;
}
