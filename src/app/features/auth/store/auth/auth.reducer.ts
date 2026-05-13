import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { refreshToken }) => ({
    ...state,
    loading: false,
    refreshToken,
  })),

  on(AuthActions.fetchAccessTokenSuccess, (state, { accessToken }) => ({
    ...state,
    accessToken,
  })),

  on(AuthActions.appLogout, () => initialAuthState),
);
