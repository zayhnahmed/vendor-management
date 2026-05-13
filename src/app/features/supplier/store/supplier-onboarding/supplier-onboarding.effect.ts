import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import * as OnboardingActions from './supplier-onboarding.actions';
import { SupplierOnboardService } from '../../services/supplier-onboard/supplier-onboard.service';
import { Store } from '@ngrx/store';
import { selectRelationshipId } from './supplier-onboarding.selector';

@Injectable()
export class SupplierOnboardingEffects {
  private actions$ = inject(Actions);
  private service = inject(SupplierOnboardService);
  private store = inject(Store);

  loadStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadSupplierOnboardingStatus),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([, relationshipId]) => {
        if (!relationshipId) {
          return of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: 'No relationship ID set' }));
        }
        return this.service.getStatus(relationshipId).pipe(
          map((res) =>
            OnboardingActions.loadSupplierOnboardingStatusSuccess({ stepStatus: res.stepStatus }),
          ),
          catchError((err) =>
            of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );

  saveOrSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.submitSupplierStep),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([{ step, payload }, relationshipId]) => {
        if (!relationshipId) {
          return of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: 'No relationship ID set' }));
        }

        let api$;
        switch (step) {
          case 1: api$ = this.service.saveStep1(relationshipId, payload); break;
          case 2: api$ = this.service.saveStep2(relationshipId, payload); break;
          case 3: api$ = this.service.saveStep3(relationshipId, payload); break;
          default: api$ = this.service.saveStep1(relationshipId, payload);
        }

        return api$.pipe(
          map(() => OnboardingActions.loadSupplierOnboardingStatus()),
          catchError((err) =>
            of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );

  finalSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.finalSubmitSupplierStep),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([{ payload }, relationshipId]) => {
        if (!relationshipId) {
          return of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: 'No relationship ID set' }));
        }
        return this.service.saveStep3(relationshipId, payload).pipe(
          switchMap(() => this.service.submit(relationshipId)),
          map(() => OnboardingActions.loadSupplierOnboardingStatus()),
          catchError((err) =>
            of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );
}
