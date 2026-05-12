import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierRegRequestState, SupplierRequestState } from './supplier-requests.state';

export const selectRequestsState = createFeatureSelector<SupplierRequestState>('supplierRequests');

export const selectSupplierRequests = createSelector(selectRequestsState, (s) => s.data);

export const selectSupplierRequestsLoading = createSelector(selectRequestsState, (s) => s.loading);

export const selectRegRequestsState =
  createFeatureSelector<SupplierRegRequestState>('supplierRegRequests');

export const selectSupplierRegRequests = createSelector(selectRegRequestsState, (s) => s.data);

export const selectSupplierRegRequestsLoading = createSelector(
  selectRegRequestsState,
  (s) => s.loading,
);
