import { createReducer, on } from '@ngrx/store';
import {
  loadSupplierRegRequests,
  loadSupplierRegRequestsFailure,
  loadSupplierRegRequestsSuccess,
  loadSupplierRequests,
  loadSupplierRequestsFailure,
  loadSupplierRequestsSuccess,
} from './supplier-requests.actions';
import { initialRegState, initialState } from './supplier-requests.state';

export const supplierRequestReducer = createReducer(
  initialState,

  on(loadSupplierRequests, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadSupplierRequestsSuccess, (state, { requests }) => ({
    ...state,
    loading: false,
    data: requests,
  })),

  on(loadSupplierRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const supplierRegRequestReducer = createReducer(
  initialRegState,

  on(loadSupplierRegRequests, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadSupplierRegRequestsSuccess, (state, { requests }) => ({
    ...state,
    loading: false,
    data: requests,
  })),

  on(loadSupplierRegRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
