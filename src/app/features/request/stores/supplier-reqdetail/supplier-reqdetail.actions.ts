import { createAction, props } from '@ngrx/store';
import { SupplierRegReqDetailApiResponse, SupplierReqDetailModel } from '../../models/supplier-registration.model';

export const loadSupplierRequestDetail = createAction(
  '[Supplier Request Detail] Load',
  props<{ id: string }>(),
);

export const loadSupplierReqDetailSuccess = createAction(
  '[Supplier Request Detail] Load Success',
  props<{ data: SupplierReqDetailModel }>(),
);

export const loadSupplierReqDetailFailure = createAction(
  '[Supplier Request Detail] Load Failure',
  props<{ error: any }>(),
);

export const approveSupplierRequestDetail = createAction(
  '[Supplier Request Detail] Approve',
  props<{ id: string }>(),
);

/// Stepper Regsiter actions
export const loadSupplierRegRequestDetail = createAction(
  '[Supplier Register Request Detail] Load',
  props<{ id: string }>(),
);

export const loadSupplierRegReqDetailSuccess = createAction(
  '[Supplier Register Request Detail] Load Success',
  props<{ data: SupplierRegReqDetailApiResponse }>(),
);

export const loadSupplierRegReqDetailFailure = createAction(
  '[Supplier Register Request Detail] Load Failure',
  props<{ error: any }>(),
);

export const approveSupplierRegRequestDetail = createAction(
  '[Supplier Register Request Detail] Approve',
  props<{ id: string }>(),
);