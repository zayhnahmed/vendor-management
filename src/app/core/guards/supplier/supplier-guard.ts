import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { getUserRole } from '../../utils/auth.util';
import { UserRole } from '../../enums/user.enum';
import { Store } from '@ngrx/store';
import {
  selectAllSupplierStepsCompleted,
  selectOnboardingLoaded,
} from '../../../features/supplier/store/supplier-onboarding/supplier-onboarding.selector';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';
import { loadSupplierOnboardingStatus } from '../../../features/supplier/store/supplier-onboarding/supplier-onboarding.actions';

export const supplierGuard: CanActivateFn = (_, __) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const store = inject(Store);

  const token = tokenService.getAccessToken();
  const role = getUserRole(token);

  if (role === UserRole.VENDOR_NEW) {
    const loaded$ = store.select(selectOnboardingLoaded);
    const completed$ = store.select(selectAllSupplierStepsCompleted);

    return loaded$.pipe(
      switchMap((loaded) => {
        if (!loaded) {
          store.dispatch(loadSupplierOnboardingStatus());
        }

        return combineLatest([loaded$, completed$]).pipe(
          filter(([loaded]) => loaded), // wait until API loads
          take(1),
          map(([_, completed]) => {
            if (completed) {
              return router.createUrlTree(['/supplier/onboard/waiting']);
            }

            return router.createUrlTree(['/supplier/onboard']);
          }),
        );
      }),
    );
  }

  if (role === UserRole.SUPER_ADMIN) {
    return router.createUrlTree(['/buyer']);
  }

  if (role === UserRole.VENDOR_ACTIVE) {
    return true;
  }

  return router.createUrlTree(['/error/unauthorized']);
};
