import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateOrderRequest, SearchOrderRequest } from '../models/in/order.in';
import {
  CreateOrderResponse,
  FindAllByClientResponse,
  SearchOrderResponse,
} from '../models/out/order.out';
import { OrderStatus } from '../models/interfaces/orderStatus.interface';
import { PaymentStatus } from '../models/interfaces/paymentStatus.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  search(filter: SearchOrderRequest): Observable<SearchOrderResponse> {
    const conditions: string[] = [];

    conditions.push(`status=${filter.status}`);

    return this.http.get<SearchOrderResponse>(
      `/orders/search?skip=${filter.skip}&take=${filter.take}${conditions.length ? `&${conditions.join('&')}` : ''}`,
    );
  }

  findAllByClient(clientId: string, paymentStatus: PaymentStatus): Observable<FindAllByClientResponse> {
    return this.http
      .get<FindAllByClientResponse>(`/orders/list/${paymentStatus}/${clientId}`)
      .pipe(map((response) => response));
  }

  create(input: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http
      .post<CreateOrderResponse>('/orders/create', input)
      .pipe(map((response) => response));
  }

  updateStatus(id: string, status: OrderStatus): Observable<void> {
    return this.http
      .patch<void>(`/orders/update-status/${id}`, { status })
      .pipe(map((response) => response));
  }
}
