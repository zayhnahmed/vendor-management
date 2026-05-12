import {
  SupplierRegReqDetailApiResponse,
  SupplierReqDetailModel,
} from '../../models/supplier-registration.model';

export interface SupplierReqDetailState {
  data: SupplierReqDetailModel | null;
  loading: boolean;
  error: any;
}

export interface SupplierRegReqDetailState {
  data: SupplierRegReqDetailApiResponse | null;
  loading: boolean;
  error: any;
}

export const initialState: SupplierReqDetailState = {
  data: null,
  loading: false,
  error: null,
};

export const initialRegState: SupplierRegReqDetailState = {
  data: null,
  loading: false,
  error: null,
};
