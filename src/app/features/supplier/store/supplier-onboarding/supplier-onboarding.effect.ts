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

  /**
   * Load onboarding status.
   * If we already have a relationshipId in the store, use it directly.
   * Otherwise fetch pending-tasks first to get the relationshipId.
   */
  loadStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadSupplierOnboardingStatus),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([, relationshipId]) => {
        if (relationshipId) {
          return this.service.getStatus(relationshipId).pipe(
            map((res) =>
              OnboardingActions.loadSupplierOnboardingStatusSuccess({ stepStatus: res.data }),
            ),
            catchError((err) =>
              of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
            ),
          );
        }

        // No relationshipId yet — fetch pending tasks to get one
        return this.service.getPendingTasks().pipe(
          switchMap((res) => {
            const tasks = res.data;
            const firstTask = Array.isArray(tasks) ? tasks[0] : null;

            if (!firstTask?.relationshipId) {
              return of(
                OnboardingActions.loadSupplierOnboardingStatusFailure({
                  error: 'No pending onboarding tasks found',
                }),
              );
            }

            const id = firstTask.relationshipId;
            this.store.dispatch(OnboardingActions.setRelationshipId({ relationshipId: id }));

            return this.service.getStatus(id).pipe(
              map((statusRes) =>
                OnboardingActions.loadSupplierOnboardingStatusSuccess({ stepStatus: statusRes.data }),
              ),
              catchError((err) =>
                of(
                  OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message }),
                ),
              ),
            );
          }),
          catchError((err) =>
            of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );

  /** Save step 1, 2, or 3 — requires relationshipId from store */
  saveOrSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.submitSupplierStep),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([{ step, payload }, relationshipId]) => {
        if (!relationshipId) {
          return of(
            OnboardingActions.loadSupplierOnboardingStatusFailure({
              error: 'Relationship ID not found. Please reload.',
            }),
          );
        }

        let api$;
        switch (step) {
          case 1:
            api$ = this.service.saveGeneralInfo(relationshipId, payload);
            break;
          case 2:
            api$ = this.service.saveFinanceInfo(relationshipId, payload);
            break;
          case 3:
            api$ = this.service.saveQualityInfo(relationshipId, payload);
            break;
          default:
            api$ = this.service.saveGeneralInfo(relationshipId, payload);
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

  /** Final submit for approval — sends POST /submit */
  finalSubmit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.finalSubmitSupplierStep),
      withLatestFrom(this.store.select(selectRelationshipId)),
      switchMap(([, relationshipId]) => {
        if (!relationshipId) {
          return of(
            OnboardingActions.loadSupplierOnboardingStatusFailure({
              error: 'Relationship ID not found. Please reload.',
            }),
          );
        }

        return this.service.submit(relationshipId).pipe(
          map(() => OnboardingActions.loadSupplierOnboardingStatus()),
          catchError((err) =>
            of(OnboardingActions.loadSupplierOnboardingStatusFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );
}
