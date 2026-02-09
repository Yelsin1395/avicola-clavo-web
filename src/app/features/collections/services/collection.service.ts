import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaymentCollectionRequest } from '../models/in/collection.in';
import { CreateCollectionResponse, FindAllCollectionResponse } from '../models/out/collection.out';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private readonly http: HttpClient) {}

  getPaymentOnAccountOrder(orderId: string): Observable<FindAllCollectionResponse> {
    return this.http
      .get<FindAllCollectionResponse>(`/collections/list/${orderId}`)
      .pipe(map((response) => response));
  }

  fullPayment(input: PaymentCollectionRequest): Observable<CreateCollectionResponse> {
    return this.http
      .post<CreateCollectionResponse>(`/collections/full-payment/${input.orderId}`, {
        paymentMethod: input.paymentMethod,
      })
      .pipe(map((response) => response));
  }

  paymentOnAccount(input: PaymentCollectionRequest): Observable<CreateCollectionResponse> {
    return this.http
      .post<CreateCollectionResponse>(`/collections/payment-on-account/${input.orderId}`, {
        paymentMethod: input.paymentMethod,
        clientPaymentAmount: input.clientPaymentAmount,
      })
      .pipe(map((response) => response));
  }
}
