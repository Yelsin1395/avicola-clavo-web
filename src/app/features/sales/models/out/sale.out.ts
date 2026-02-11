import { BaseResponse } from '@core/models/baseResponse.model';
import { Sale } from '../entity/sale.entity';

export interface SearchSaleResponse extends BaseResponse {
  data: {
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    items: Sale[];
  };
}

export interface CreateSaleResponse extends BaseResponse {
  data: { id: string };
}
