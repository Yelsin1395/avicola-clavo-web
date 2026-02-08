import { OrderStatus } from "../interfaces/orderStatus.interface";
import { PaymentMethod } from "../interfaces/paymentMethod.interface";
import { PaymentStatus } from "../interfaces/paymentStatus.interface";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  subTotal: number;
}

export interface Order {
  id: string;
  clientId: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date
  updatedAt: Date;
}
