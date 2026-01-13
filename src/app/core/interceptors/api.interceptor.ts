import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `/avicola-clavo-experience${req.url}` });
  return next(apiReq);
};
