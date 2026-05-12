import { SupplierRegistrationModel } from '../../../request/models/supplier-registration.model';

export interface SupplierRegistrationState {
  formData: SupplierRegistrationModel | null;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export const initialState: SupplierRegistrationState = {
  formData: null,
  submitting: false,
  submitted: false,
  error: null,
};
