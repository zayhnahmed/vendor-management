import { createReducer, on } from '@ngrx/store';
import * as SupplierActions from './supplier-registration.actions';
import { initialState } from './supplier-registration.state';
export const supplierRegistrationReducer = createReducer(
  initialState,

  on(SupplierActions.submitSupplierRegistration, (state, { payload }) => ({
    ...state,
    formData: payload,
    submitting: true,
    submitted: false,
    error: null,
  })),

  on(SupplierActions.submitSupplierRegistrationSuccess, (state) => ({
    ...state,
    submitting: false,
    submitted: true,
  })),

  on(SupplierActions.submitSupplierRegistrationFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    submitted: false,
    error,
  })),
);
