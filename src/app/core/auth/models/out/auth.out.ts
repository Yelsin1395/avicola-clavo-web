import { BaseResponse } from '@core/models/baseResponse.model';

export interface AuthDecode {
  sub: string;
  dni: string;
  fullName: string;
  role: string;
  isOwner: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt?: Date;
  iat?: number;
  exp?: number;
}
export interface ReponseLogin extends BaseResponse {
  data: { access_token: string };
}
