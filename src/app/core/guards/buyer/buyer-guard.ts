import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { inject } from '@angular/core';
import { getUserRole } from '../../utils/auth.util';
import { UserRole } from '../../enums/user.enum';

export const buyerGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getAccessToken();
  const role = getUserRole(token);

  if (role === UserRole.SUPER_ADMIN || role === UserRole.BUYER) {
    return true;
  }

  if (role === UserRole.SUPPLIER) {
    return router.createUrlTree(['/supplier']);
  }

  return router.createUrlTree(['/error/unauthorized']);
};
