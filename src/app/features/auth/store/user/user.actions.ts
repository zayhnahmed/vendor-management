import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../../models/auth-user.model';

export const loadUser = createAction('[Auth] Load User');

export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: AuthUser }>(),
);

export const loadUserFailure = createAction('[Auth] Load User Failure', props<{ error: any }>());
