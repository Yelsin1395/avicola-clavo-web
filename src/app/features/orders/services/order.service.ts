import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateOrderRequest } from '../models/in/order.in';
import { CreateOrderResponse } from '../models/out/order.out';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  create(input: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>('/orders/create', input).pipe(map((response) => response));
  }
}
