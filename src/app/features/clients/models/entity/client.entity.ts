import { StatusPaymentClient } from '../interfaces/paymentStatusClient.interface';

export interface Client {
  id?: string;
  name: string;
  surname: string;
  fullName?: string;
  label?: string;
  currentBalance: number;
  currentPaymentStatus: StatusPaymentClient;
  pendingOrdersPayments: number;
  lasOrderDate?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
