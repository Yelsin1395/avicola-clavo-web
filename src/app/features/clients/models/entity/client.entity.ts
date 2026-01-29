import { StatusPaymentClient } from '../interfaces/paymentStatusClient.interface';

export interface Client {
  id?: string;
  dni?: string;
  name: string;
  surname: string;
  fullName?: string;
  label?: string;
  currentBalance: number;
  currentPaymentStatus: StatusPaymentClient;
  pendingOrdersPayments: number;
  lastOrderDate?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
