import { FormControl } from '@angular/forms';
import { PaymentMethod } from '../interfaces/paymentMethod.interface';

export interface OrderItemRequest {
  productId: string;
  productName: string;
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
