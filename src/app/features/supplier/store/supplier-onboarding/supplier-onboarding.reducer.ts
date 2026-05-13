import { createReducer, on } from '@ngrx/store';
import * as Actions from './supplier-onboarding.actions';
import { initialState } from './supplier-onboarding.state';

function mapStep(step: string): number {
  switch (step) {
    case 'STEP1_PENDING': return 1;
    case 'STEP2_PENDING': return 2;
    case 'STEP3_PENDING': return 3;
    default: return 1;
  }
}

export const supplierOnboardingReducer = createReducer(
  initialState,

  on(Actions.setRelationshipId, (state, { relationshipId }) => ({
    ...state,
    relationshipId,
  })),

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

  on(Actions.loadSupplierOnboardingStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(Actions.submitSupplierStep, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),

  on(Actions.finalSubmitSupplierStep, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
);
