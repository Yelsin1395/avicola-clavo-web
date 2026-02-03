import { BaseResponse } from '@core/models/baseResponse.model';

export interface CreateOrderResponse extends BaseResponse {
  data: { id: string };
}
