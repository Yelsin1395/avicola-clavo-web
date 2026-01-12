import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { map } from 'rxjs/operators';

export const privateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated.pipe(
    map((isAuth) => {
      if (!isAuth) {
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
};
