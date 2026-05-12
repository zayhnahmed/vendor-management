import { SupplierStepData } from "../../../request/models/suplier-detail.model";



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
  currentStep: number;
  stepStatus: SupplierStepStatus | null;

  prefillData: SupplierStepData<1> | null;
  step1: SupplierStepData<1> | null;
  step2: SupplierStepData<2> | null;
  step3: SupplierStepData<3> | null;

  loading: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialState: SupplierOnboardingState = {
  currentStep: 1,
  stepStatus: null,

  prefillData: null,
  step1: null,
  step2: null,
  step3: null,

  loading: false,
  saving: false,
  loaded: false,
  error: null,
};
