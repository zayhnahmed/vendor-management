import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as SupplierActions from './supplier-reqdetail.actions';
import { SupplierRequestService } from '../../services/supplier-request/supplier-request.service';

@Injectable()
export class SupplierReqDetailEffects {
  private actions$ = inject(Actions);
  private service = inject(SupplierRequestService);

  loadSupplierReqDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.loadSupplierRequestDetail),
      switchMap(({ id }) =>
        this.service.getSupplierRequestsByApplicationId(id).pipe(
          map((res) => SupplierActions.loadSupplierReqDetailSuccess({ data: res.request })),
          catchError((error) => of(SupplierActions.loadSupplierReqDetailFailure({ error }))),
        ),
      ),
    ),
  );

  loadSupplierRegReqDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.loadSupplierRegRequestDetail),
      switchMap(({ id }) =>
        this.service.getSupplierDetailById(id).pipe(
          map((res) => SupplierActions.loadSupplierRegReqDetailSuccess({ data: res })),
          catchError((error) => of(SupplierActions.loadSupplierRegReqDetailFailure({ error }))),
        ),
      ),
    ),
  );

  approveSupplierReqDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.approveSupplierRequestDetail),
      switchMap(({ id }) =>
        this.service
          .approveApplicationRequest(id)
          .pipe(map((_) => SupplierActions.loadSupplierRequestDetail({ id }))),
      ),
    ),
  );

  approveSupplierRegReqDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.approveSupplierRegRequestDetail),
      switchMap(({ id }) =>
        this.service
          .approveRegistrationRequest(id)
          .pipe(map((_) => SupplierActions.loadSupplierRegRequestDetail({ id }))),
      ),
    ),
  );
}
