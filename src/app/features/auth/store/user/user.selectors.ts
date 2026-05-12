import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthUserState } from "./user.state";

export const selectAuthState =
  createFeatureSelector<AuthUserState>('authUser');

export const selectUser =
  createSelector(selectAuthState, s => s.user);

export const selectUserRole =
  createSelector(selectUser, user => user?.role);

export const selectUserLoaded =
  createSelector(selectAuthState, s => s.loaded);