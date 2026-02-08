import { BaseResponse } from '@core/models/baseResponse.model';
import { Order } from '../entity/order.entity';

export interface OrderItems extends Order {
  clientName: string;
  clientLabel: string;
}

export interface SearchOrderResponse extends BaseResponse {
  data: {
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    items: OrderItems[];
  };
}

export interface FindAllByClientResponse extends BaseResponse {
  data: Order[];
}

export interface CreateOrderResponse extends BaseResponse {
  data: { id: string };
}
