import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierOnboardingState } from './supplier-onboarding.state';

export const ONBOARDING_KEY = 'supplierOnboarding';

export const selectSupplierOnboardingState =
  createFeatureSelector<SupplierOnboardingState>(ONBOARDING_KEY);

export const selectRelationshipId = createSelector(
  selectSupplierOnboardingState,
  (s) => s.relationshipId,
);

export const selectSupplierCurrentStep = createSelector(
  selectSupplierOnboardingState,
  (s) => s.currentStep,
);

export const selectOnboardingLoaded = createSelector(
  selectSupplierOnboardingState,
  (s) => s.loaded,
);

export const selectAllSupplierStepsCompleted = createSelector(
  selectSupplierOnboardingState,
  (s) => s.stepStatus?.allStepsCompleted || false,
);
