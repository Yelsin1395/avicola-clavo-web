import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import { RangeDaysEnum } from '../interfaces/rangeDays.interface';
import { SaleStatusEnum } from '../interfaces/saleStatus.interface';

export interface SearchSaleRequest {
  status?: SaleStatusEnum;
  rangeDays: RangeDaysEnum;
  take: number;
  skip: number;
}

export interface SaleItemRequest {
  productId: string;
  productName: string;
  productUnitsMeasurementCode?: string;
  productUnitsMeasurementName?: string;
  quantity: number;
  priceAtPurchase: number;
  subTotal: number;
}

export interface CreateSaleRequest {
  paymentMethod: PaymentMethod;
  items: SaleItemRequest[];
  totalAmount: number;
}
