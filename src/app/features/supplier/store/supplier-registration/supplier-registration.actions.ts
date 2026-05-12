import { createAction, props } from '@ngrx/store';
import { SupplierRegistrationModel } from '../../../request/models/supplier-registration.model';

export const submitSupplierRegistration = createAction(
  '[Supplier Registration] Submit',
  props<{ payload: SupplierRegistrationModel }>(),
);

export const submitSupplierRegistrationSuccess = createAction(
  '[Supplier Registration] Submit Success',
  props<{ response: any }>(),
);

export const submitSupplierRegistrationFailure = createAction(
  '[Supplier Registration] Submit Failure',
  props<{ error: string }>(),
);
