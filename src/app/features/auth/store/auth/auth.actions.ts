import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ refreshToken: string }>(),
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const fetchAccessToken = createAction(
  '[Auth] Fetch Access Token',
  props<{ refreshToken: string }>(),
);

export const fetchAccessTokenSuccess = createAction(
  '[Auth] Fetch Access Token Success',
  props<{ accessToken: string }>(),
);

export const appLogout = createAction('[Auth] Logout');
