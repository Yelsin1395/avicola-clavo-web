import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateClientRequest, SearchClientRequest } from '../models/in/client.in';
import { map, Observable } from 'rxjs';
import {
  CreateClientResponse,
  GetByIdClientResponse,
  SearchClientResponse,
  UpdateClientResponse,
} from '../models/out/client.out';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private readonly http: HttpClient) {}

  search(filter: SearchClientRequest): Observable<SearchClientResponse> {
    const conditions: string[] = [];

    if (filter.fullName) {
      conditions.push(`fullName=${encodeURIComponent(filter.fullName)}`);
    }

    return this.http
      .get<SearchClientResponse>(
        `/clients/search?skip=${filter.skip}&take=${filter.take}${conditions.length ? `&${conditions.join('&')}` : ''}`,
      )
      .pipe(map((response) => response));
  }

  getById(id: string): Observable<GetByIdClientResponse> {
    return this.http.get<GetByIdClientResponse>(`/clients/${id}`).pipe(map((response) => response));
  }

  create(input: CreateClientRequest): Observable<CreateClientResponse> {
    return this.http
      .post<CreateClientResponse>(`/clients/create`, input)
      .pipe(map((response) => response));
  }

  update(id: string, input: CreateClientRequest): Observable<UpdateClientResponse> {
    return this.http
      .put<UpdateClientResponse>(`/clients/update/${id}`, input)
      .pipe(map((response) => response));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/clients/delete/${id}`);
  }
}
