import { createReducer, on } from '@ngrx/store';
import { initialRegState, initialState } from './supplier-reqdetail.state';
import {
  loadSupplierRegReqDetailFailure,
  loadSupplierRegReqDetailSuccess,
  loadSupplierRegRequestDetail,
  loadSupplierReqDetailFailure,
  loadSupplierReqDetailSuccess,
  loadSupplierRequestDetail,
} from './supplier-reqdetail.actions';

export const supplierRequestDetailReducer = createReducer(
  initialState,

  on(loadSupplierRequestDetail, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadSupplierReqDetailSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    data,
  })),

  on(loadSupplierReqDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const supplierRegRequestDetailReducer = createReducer(
  initialRegState,

  on(loadSupplierRegRequestDetail, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadSupplierRegReqDetailSuccess, (state, { data }) => {
    console.log(data);
    return {
      ...state,
      loading: false,
      data,
    };
  }),

  on(loadSupplierRegReqDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
