import { createAction, props } from '@ngrx/store';
import { SupplierRegRequestItem, SupplierRequestItem } from '../../../request/models/supplier-request-item.model';

export const loadSupplierRequests = createAction(
  '[Supplier Requests] Load Requests',
  props<{ page: number; limit: number }>(),
);

export const loadSupplierRequestsSuccess = createAction(
  '[Supplier Requests] Load Requests Success',
  props<{ requests: SupplierRequestItem[] }>(),
);

export const loadSupplierRequestsFailure = createAction(
  '[Supplier Requests] Load Requests Failure',
  props<{ error: any }>(),
);

export const loadSupplierRegRequests = createAction(
  '[Supplier Register Requests] Load Requests',
  props<{ page: number; limit: number }>(),
);

export const loadSupplierRegRequestsSuccess = createAction(
  '[Supplier Register Requests] Load Requests Success',
  props<{ requests: SupplierRegRequestItem[] }>(),
);

export const loadSupplierRegRequestsFailure = createAction(
  '[Supplier Register Requests] Load Requests Failure',
  props<{ error: any }>(),
);
