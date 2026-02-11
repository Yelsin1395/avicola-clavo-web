import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import { SaleStatusEnum } from '../interfaces/saleStatus.interface';
import { PaymentStatus } from '@features/orders/models/interfaces/paymentStatus.interface';

interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  productUnitsMeasurementCode?: string;
  productUnitsMeasurementName?: string;
  quantity: number;
  priceAtPurchase: number;
  subTotal: number;
}

export interface Sale {
  id: string;
  status: SaleStatusEnum;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: SaleItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
