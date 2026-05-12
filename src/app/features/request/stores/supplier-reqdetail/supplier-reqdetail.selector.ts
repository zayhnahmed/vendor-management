import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierRegReqDetailState, SupplierReqDetailState } from './supplier-reqdetail.state';

export const selectSupplierReqDetailState =
  createFeatureSelector<SupplierReqDetailState>('supplierRequestDetail');

export const selectSupplierRequestDetail = createSelector(
  selectSupplierReqDetailState,
  (s) => s.data,
);

export const selectRequestDetailLoading = createSelector(
  selectSupplierReqDetailState,
  (s) => s.loading,
);

export const selectSupplierRegReqDetailState = createFeatureSelector<SupplierRegReqDetailState>(
  'supplierRegRequestDetail',
);

export const selectSupplierRegRequestDetail = createSelector(
  selectSupplierRegReqDetailState,
  (s) => s.data,
);

export const selectRegRequestDetailLoading = createSelector(
  selectSupplierRegReqDetailState,
  (s) => s.loading,
);
