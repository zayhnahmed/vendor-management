import { createAction, props } from '@ngrx/store';
import { SupplierStepStatus } from './supplier-onboarding.state';

export const setRelationshipId = createAction(
  '[Onboarding] Set Relationship ID',
  props<{ relationshipId: string }>(),
);

export const loadSupplierOnboardingStatus = createAction('[Onboarding] Load Status');

export const loadSupplierOnboardingStatusSuccess = createAction(
  '[Onboarding] Load Supplier Status Success',
  props<{ stepStatus: SupplierStepStatus }>(),
);

export const loadSupplierOnboardingStatusFailure = createAction(
  '[Onboarding] Load Supplier Status Failure',
  props<{ error: string }>(),
);

export const submitSupplierStep = createAction(
  '[Onboarding] Submit Supplier Step',
  props<{ step: number; payload: any }>(),
);

export const finalSubmitSupplierStep = createAction(
  '[Onboarding] Final Submit',
  props<{ payload: any }>(),
);
