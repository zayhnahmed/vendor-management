import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SupplierActions from './supplier-registration.actions';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { SupplierRegistrationService } from '../../services/supplier-registration/supplier-registration.service';
import { Router } from '@angular/router';

@Injectable()
export class SupplierRegistrationEffects {
  private actions$ = inject(Actions);
  private service = inject(SupplierRegistrationService);
  private router: Router = inject(Router);

  submitSupplierRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.submitSupplierRegistration),
      switchMap((action) =>
        this.service.registerSupplier(action.payload).pipe(
          map((response) => SupplierActions.submitSupplierRegistrationSuccess({ response })),
          catchError((error) =>
            of(
              SupplierActions.submitSupplierRegistrationFailure({
                error: error?.message ?? 'Supplier registration failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  redirectOnSubmitFOrm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SupplierActions.submitSupplierRegistrationSuccess),
        tap(() => {
          this.router.navigateByUrl('supplier/onboard/waiting');
        }),
      ),
    { dispatch: false },
  );
}
