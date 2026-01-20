import {
  UnitsMeasurementCode,
  UnitsMeasurementName,
} from '../interfaces/unitsMeasurement.interface';

export interface Product {
  id?: string;
  name: string;
  description: string;
  unitsMeasurementName: UnitsMeasurementName;
  unitsMeasurementCode: UnitsMeasurementCode;
  price: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
