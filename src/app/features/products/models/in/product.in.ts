import { FormControl } from '@angular/forms';
import {
  UnitsMeasurementCode,
  UnitsMeasurementName,
} from '../interfaces/unitsMeasurement.interface';

export interface CreateProductRequest {
  name: string;
  description?: string;
  unitsMeasurementName: UnitsMeasurementName;
  unitsMeasurementCode: UnitsMeasurementCode;
  price: number;
}

export interface CreateProductForm {
  name: FormControl<string>;
  description: FormControl<string>;
  unitsMeasurementName: FormControl<UnitsMeasurementName | string>;
  price: FormControl<number>;
}

export interface SearchProductRequest {
  name?: string;
  take: number;
  skip: number;
}
