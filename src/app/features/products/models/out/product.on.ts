import { BaseResponse } from '@core/models/baseResponse.model';
import { Product } from '../entity/product.entity';

export interface SearchProductResponse extends BaseResponse {
  data: { count: number; totalPages: number; currentPage: number; limit: number; items: Product[] };
}

export interface CreateProductResponse extends BaseResponse {
  data: { id: string };
}
