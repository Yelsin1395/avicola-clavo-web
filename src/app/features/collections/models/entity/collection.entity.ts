import { PaymentMethod } from '@features/orders/models/interfaces/paymentMethod.interface';
import { PaymentStatus } from '@features/orders/models/interfaces/paymentStatus.interface';

export interface Collection {
  id: string;
  orderId: string;
  clientId: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalOrderAmount: number;
  clientAccumulatedAmount: number;
  remainingBalanceTotalOrderAmount?: number;
  createdAt: Date;
}
