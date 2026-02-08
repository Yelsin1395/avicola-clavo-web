import { BaseResponse } from '@core/models/baseResponse.model';
import { Collection } from '../entity/collection.entity';

export interface FindAllCollectionResponse extends BaseResponse {
  data: Collection[];
}

export interface CreateCollectionResponse extends BaseResponse {
  data: { id: string };
}
