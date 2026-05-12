import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as SupplierActions from './supplier-requests.actions';
import { SupplierRequestService } from '../../../request/services/supplier-request/supplier-request.service';

@Injectable()
export class SupplierRequestsEffects {
  private actions$ = inject(Actions);
  private service = inject(SupplierRequestService);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.loadSupplierRequests),
      switchMap(({ page, limit }) =>
        this.service.getRequests(page, limit).pipe(
          map((res) => SupplierActions.loadSupplierRequestsSuccess({ requests: res.requests })),
          catchError((error) => of(SupplierActions.loadSupplierRequestsFailure({ error }))),
        ),
      ),
    ),
  );

  loadRegRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.loadSupplierRegRequests),
      switchMap(({ page, limit }) =>
        this.service.getRegistrationRequests(page, limit).pipe(
          map((res) => SupplierActions.loadSupplierRegRequestsSuccess({ requests: res.vendors })),
          catchError((error) => of(SupplierActions.loadSupplierRegRequestsFailure({ error }))),
        ),
      ),
    ),
  );
}
