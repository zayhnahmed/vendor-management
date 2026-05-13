export interface SupplierStepStatus {
  allStepsCompleted: boolean;
  currentStep: string;
  vendorStatus: string;
  nextStepToComplete: string;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
}

export interface SupplierOnboardingState {
  relationshipId: string | null;
  currentStep: number;
  stepStatus: SupplierStepStatus | null;
  loading: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialState: SupplierOnboardingState = {
  relationshipId: null,
  currentStep: 1,
  stepStatus: null,
  loading: false,
  saving: false,
  loaded: false,
  error: null,
};
