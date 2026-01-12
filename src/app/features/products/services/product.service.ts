import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateProductRequest, SearchProductRequest } from '../models/in/product.in';
import { CreateProductResponse, SearchProductResponse } from '../models/out/product.on';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  search(filter: SearchProductRequest): Observable<SearchProductResponse> {
    return this.http
      .get<SearchProductResponse>(`/products/search?skip=${filter.skip}&take=${filter.take}`)
      .pipe(map((response) => response));
  }

  create(input: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http
      .post<CreateProductResponse>(`/products/create`, input)
      .pipe(map((response) => response));
  }
}
