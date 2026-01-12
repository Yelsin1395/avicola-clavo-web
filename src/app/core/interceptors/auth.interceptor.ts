import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@core/auth/services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const request = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(request);
};
