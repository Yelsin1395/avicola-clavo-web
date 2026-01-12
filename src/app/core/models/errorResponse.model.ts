export interface ErrorResponse {
  status: number;
  statusCode: string;
  errorCode?: string;
  message: string;
  reasons: [any] | null | any;
  timestamp: string;
}
