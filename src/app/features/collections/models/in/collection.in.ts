import { PaymentMethod } from "@features/orders/models/interfaces/paymentMethod.interface";

export interface PaymentCollectionRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  clientPaymentAmount?: number;
}
