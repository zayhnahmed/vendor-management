import {
  SupplierRegRequestItem,
  SupplierRequestItem,
} from '../../../request/models/supplier-request-item.model';

export interface SupplierRequestState {
  data: SupplierRequestItem[];
  loading: boolean;
  error: any;
}

export interface SupplierRegRequestState {
  data: SupplierRegRequestItem[];
  loading: boolean;
  error: any;
}

export const initialState: SupplierRequestState = {
  data: [],
  loading: false,
  error: null,
};

export const initialRegState: SupplierRegRequestState = {
  data: [],
  loading: false,
  error: null,
};
