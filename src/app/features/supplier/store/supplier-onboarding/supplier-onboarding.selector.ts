import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierOnboardingState } from './supplier-onboarding.state';

export const ONBOARDING_KEY = 'supplierOnboarding';

export const selectSupplierOnboardingState =
  createFeatureSelector<SupplierOnboardingState>(ONBOARDING_KEY);

export const selectSupplierCurrentStep = createSelector(
  selectSupplierOnboardingState,
  (s) => s.currentStep,
);

export const selectSupplierPrefillData = createSelector(
  selectSupplierOnboardingState,
  (s) => s.prefillData,
);

export const selectOnboardingLoaded = createSelector(
  selectSupplierOnboardingState,
  (s) => s.loaded,
);

export const selectAllSupplierStepsCompleted = createSelector(
  selectSupplierOnboardingState,
  (s) => s.stepStatus?.allStepsCompleted || false,
);

export const selectSupplierStep1 = createSelector(selectSupplierOnboardingState, (s) => s.step1);

export const selectSupplierStep2 = createSelector(selectSupplierOnboardingState, (s) => s.step2);

export const selectSupplierStep3 = createSelector(selectSupplierOnboardingState, (s) => s.step3);
