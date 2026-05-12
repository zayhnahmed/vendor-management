import { createAction, props } from '@ngrx/store';
import { SupplierStepStatus } from './supplier-onboarding.state';
import { SupplierStepData } from '../../../request/models/suplier-detail.model';

// status
export const loadSupplierOnboardingStatus = createAction('[Onboarding] Load Status');

export const loadSupplierOnboardingStatusSuccess = createAction(
  '[Onboarding] Load Supplier Status Success',
  props<{ stepStatus: SupplierStepStatus }>(),
);

export const loadSupplierOnboardingStatusFailure = createAction(
  '[Onboarding] Load Supplier Status Failure',
  props<{ error: string }>(),
);

export const loadSupplierPrefillData = createAction('[Onboarding] Load Prefill Data');

export const loadSupplierPrefillDataSuccess = createAction(
  '[Onboarding] Load Prefill Data Success',
  props<{ data: SupplierStepData<1> }>(),
);

export const loadSupplierPrefillDataFailure = createAction(
  '[Onboarding] Load Prefill Data Failure',
  props<{ error: string }>(),
);

// step APIs
export const loadSupplierStep = createAction(
  '[Onboarding] Load Supplier Step',
  props<{ step: number }>(),
);

export const loadSupplierStepSuccess = createAction(
  '[Onboarding] Load Supplier Step Success',
  props<{
    step: number;
    data: SupplierStepData<1 | 2 | 3>;
  }>(),
);

export const submitSupplierStep = createAction(
  '[Onboarding] Submit Supplier Step',
  props<{
    step: number;
    payload: SupplierStepData<1 | 2 | 3>;
  }>(),
);

export const finalSubmitSupplierStep = createAction(
  '[Onboarding] Final Submit Supplier Step',
  props<{
    payload: SupplierStepData<3>;
  }>(),
);

export const updateSupplierStep = createAction(
  '[Onboarding] Update Supplier Step',
  props<{
    step: number;
    payload: SupplierStepData<1 | 2 | 3>;
  }>(),
);
