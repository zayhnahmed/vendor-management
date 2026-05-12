import { createReducer, on } from '@ngrx/store';
import * as Actions from './supplier-onboarding.actions';
import { initialState } from './supplier-onboarding.state';
import { SupplierStepData } from '../../../request/models/suplier-detail.model';

function mapStep(step: string): number {
  switch (step) {
    case 'STEP1_PENDING':
      return 1;
    case 'STEP2_PENDING':
      return 2;
    case 'STEP3_PENDING':
      return 3;
    default:
      return 1;
  }
}

export const supplierOnboardingReducer = createReducer(
  initialState,

  on(Actions.loadSupplierOnboardingStatus, (state) => ({
    ...state,
    loading: true,
  })),

  on(Actions.loadSupplierOnboardingStatusSuccess, (state, { stepStatus }) => ({
    ...state,
    loading: false,
    loaded: true,
    stepStatus,
    currentStep: mapStep(stepStatus.currentStep),
  })),

  on(Actions.loadSupplierPrefillData, (state) => ({
    ...state,
    loading: true,
  })),

  on(Actions.loadSupplierPrefillDataSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    loaded: true,
    prefillData: data,
  })),

  on(Actions.loadSupplierStepSuccess, (state, { step, data }) => {
    if (step === 1) return { ...state, step1: data as SupplierStepData<1> };
    if (step === 2) return { ...state, step2: data as SupplierStepData<2> };
    if (step === 3) return { ...state, step3: data as SupplierStepData<3> };

    return state;
  }),

  on(Actions.updateSupplierStep, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(Actions.submitSupplierStep, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
);
