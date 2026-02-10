import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  constructor(private readonly http: HttpClient) {}

  generateTicketOrder(orderId: string): Observable<void> {
    return this.http.get<void>(`/printer/order/${orderId}`).pipe(map((response) => response));
  }
}
