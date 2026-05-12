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

export const supplierOnboardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const store = inject(Store);

  const token = tokenService.getAccessToken();
  const role = getUserRole(token);
  if (role !== UserRole.VENDOR_NEW) {
    return router.createUrlTree(['/error/not-found']);
  }

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

          return true;
        }),
      );
    }),
  );
};
