import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSaleRequest, SearchSaleRequest } from '../models/in/sale.in';
import { map, Observable } from 'rxjs';
import { CreateSaleResponse, SearchSaleResponse } from '../models/out/sale.out';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private readonly http: HttpClient) {}

  search(filter: SearchSaleRequest): Observable<SearchSaleResponse> {
    const conditions: string[] = [];

    conditions.push(`rangeDays=${filter.rangeDays}`);

    return this.http.get<SearchSaleResponse>(
      `/sales/search?skip=${filter.skip}&take=${filter.take}${conditions.length ? `&${conditions.join('&')}` : ''}`,
    );
  }

  create(input: CreateSaleRequest): Observable<CreateSaleResponse> {
    return this.http
      .post<CreateSaleResponse>('/sales/create', input)
      .pipe(map((response) => response));
  }
}
