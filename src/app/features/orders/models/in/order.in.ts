import { PaymentMethod } from '../interfaces/paymentMethod.interface';
import { OrderStatus } from '../interfaces/orderStatus.interface';

export interface SearchOrderRequest {
  status: OrderStatus;
  take: number;
  skip: number;
}

export interface OrderItemRequest {
  productId: string;
  productName: string;
  productUnitsMeasurementCode?: string;
  productUnitsMeasurementName?: string;
  priceAtPurchase: number;
  quantity: number;
  subTotal: number;
}

export interface CreateOrderRequest {
  clientId: string;
  isPendingPayment: boolean;
  paymentMethod?: PaymentMethod;
  items: OrderItemRequest[];
  totalAmount: number;
}
