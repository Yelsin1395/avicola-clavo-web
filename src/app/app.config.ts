import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

import { routes } from './app.routes';
import { apiInterceptor } from '@core/interceptors/api.interceptor';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { JwtService } from '@core/auth/services/jwt.service';
import { AuthService } from '@core/auth/services/auth.service';
import { EMPTY } from 'rxjs';

function initAuth(jwtService: JwtService, authService: AuthService) {
  return () => (jwtService.getToken() ? authService.verifyAuth() : EMPTY);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHotToastConfig(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const initializerFn = initAuth(inject(JwtService), inject(AuthService));
      return initializerFn();
    }),
  ],
};
