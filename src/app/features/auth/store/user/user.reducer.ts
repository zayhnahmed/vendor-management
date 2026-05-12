import { createReducer, on } from '@ngrx/store';
import { initialState } from './user.state';
import { loadUser, loadUserFailure, loadUserSuccess } from './user.actions';

export const authUserReducer = createReducer(
  initialState,

  on(loadUser, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    loaded: true,
    user,
  })),

  on(loadUserFailure, (state) => ({
    ...state,
    loading: false,
    loaded: false,
  })),
);
