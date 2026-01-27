import { BaseResponse } from '@core/models/baseResponse.model';
import { Client } from '../entity/client.entity';

export interface SearchClientResponse extends BaseResponse {
  data: { count: number; totalPages: number; currentPage: number; limit: number; items: Client[] };
}

export interface GetByIdClientResponse extends BaseResponse {
  data: Client;
}

export interface CreateClientResponse extends BaseResponse {
  data: { id: string };
}

export interface UpdateClientResponse extends BaseResponse {
  data: Client;
}
