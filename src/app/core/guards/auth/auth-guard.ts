import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    return true;
  }

  // ❌ Not logged in → redirect
  return router.createUrlTree(['/auth/login']);
};
