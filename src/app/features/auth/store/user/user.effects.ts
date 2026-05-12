import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth/auth.service';
import * as UserActions from './user.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthUserApiResponse } from '../../models/auth-user.model';

@Injectable()
export class AuthUserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap((_) =>
        this.authService.currentUser.pipe(
          map((res: AuthUserApiResponse) => UserActions.loadUserSuccess({ user: res.vendor })),
          catchError((err) => of(UserActions.loadUserFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}
