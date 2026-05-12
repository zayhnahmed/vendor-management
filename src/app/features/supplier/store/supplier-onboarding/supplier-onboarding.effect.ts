import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import * as OnboardingActions from './supplier-onboarding.actions';
import { SupplierOnboardService } from '../../services/supplier-onboard/supplier-onboard.service';
import {  } from './supplier-onboarding.state';
import { SupplierStepData } from '../../../request/models/suplier-detail.model';

@Injectable()
export class SupplierOnboardingEffects {
  private actions$ = inject(Actions);
  private _service = inject(SupplierOnboardService);
  public get service() {
    return this._service;
  }
  public set service(value) {
    this._service = value;
  }

  // Load status
  loadStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadSupplierOnboardingStatus),
      switchMap(() =>
        this.service.getStatus().pipe(
          map((res) =>
            OnboardingActions.loadSupplierOnboardingStatusSuccess({
              stepStatus: res.stepStatus,
            }),
          ),
          catchError((err) =>
            of(
              OnboardingActions.loadSupplierOnboardingStatusFailure({
                error: err.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load prefill data
  loadPrefillData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadSupplierPrefillData),
      switchMap(() => {
        return this.service.getPrefillData()!.pipe(
          map((data) => OnboardingActions.loadSupplierPrefillDataSuccess({ data: data.preFilled })),
          catchError((error) =>
            of(OnboardingActions.loadSupplierPrefillDataFailure({ error: error })),
          ),
        );
      }),
    ),
  );

  // Load step
  loadStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadSupplierStep),
      mergeMap(({ step }) => {
        let api$: Observable<SupplierStepData<1 | 2 | 3>>;

        switch (step) {
          case 1:
            api$ = this.service.getGeneralInfo();
            break;
          case 2:
            api$ = this.service.getFinanceInfo();
            break;
          case 3:
            api$ = this.service.getQualityInfo();
            break;
        }

        return api$!.pipe(
          map((data) => OnboardingActions.loadSupplierStepSuccess({ step, data: data })),
        );
      }),
    ),
  );

  // Save / Submit
  saveOrSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.submitSupplierStep),
      switchMap(({ step, payload }) => {
        let api$;

        switch (step) {
          case 1:
            api$ = this.service.saveGeneralInfo(payload as SupplierStepData<1>);
            break;
          case 2:
            api$ = this.service.saveFinanceInfo(payload as SupplierStepData<2>);
            break;
          case 3:
            api$ = this.service.saveQualityInfo(payload as SupplierStepData<3>);
            break;
        }

        return api$!.pipe(
          // 🔥 after success → reload step
          //   map(() => OnboardingActions.loadSupplierStep({ step })),
          map(() => OnboardingActions.loadSupplierOnboardingStatus()),
        );
      }),
    ),
  );

  // Final Submit
  finalSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.finalSubmitSupplierStep),
      switchMap(({ payload }) => {
        return this.service
          .submitFinalInfo(payload as SupplierStepData<3>)!
          .pipe(map(() => OnboardingActions.loadSupplierOnboardingStatus()));
      }),
    ),
  );

  // Update
  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.updateSupplierStep),
      switchMap(({ step, payload }) => {
        let api$;

        switch (step) {
          case 1:
            api$ = this.service.updateGeneralInfo(payload as SupplierStepData<1>);
            break;
          case 2:
            api$ = this.service.updateFinanceInfo(payload as SupplierStepData<2>);
            break;
          case 3:
            api$ = this.service.updateQualityInfo(payload as SupplierStepData<3>);
            break;
        }

        return api$!.pipe(
          // 🔥 after success → reload step
          map(() => OnboardingActions.loadSupplierOnboardingStatus()),
        );
      }),
    ),
  );
}
