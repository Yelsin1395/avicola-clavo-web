import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateProductRequest, SearchProductRequest } from '../models/in/product.in';
import {
  CreateProductResponse,
  GetByIdProductResponse,
  SearchProductResponse,
  UpdateProductResponse,
} from '../models/out/product.out';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  search(filter: SearchProductRequest): Observable<SearchProductResponse> {
    const conditions: string[] = [];

    if (filter.name) {
      conditions.push(`name=${encodeURIComponent(filter.name)}`);
    }

    return this.http
      .get<SearchProductResponse>(
        `/products/search?skip=${filter.skip}&take=${filter.take}${conditions.length ? `&${conditions.join('&')}` : ''}`,
      )
      .pipe(map((response) => response));
  }

  getById(id: string): Observable<GetByIdProductResponse> {
    return this.http
      .get<GetByIdProductResponse>(`/products/${id}`)
      .pipe(map((response) => response));
  }

  create(input: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http
      .post<CreateProductResponse>(`/products/create`, input)
      .pipe(map((response) => response));
  }

  update(id: string, input: CreateProductRequest): Observable<UpdateProductResponse> {
    return this.http
      .put<UpdateProductResponse>(`/products/update/${id}`, input)
      .pipe(map((response) => response));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/products/delete/${id}`);
  }
}
