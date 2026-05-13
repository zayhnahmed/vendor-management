import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TokenService } from '../../../../core/services/token/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private readonly tokenService: TokenService = inject(TokenService);
  private readonly router: Router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.username, action.password).pipe(
          tap((res) => {
            this.tokenService.setRefreshToken(res.refresh_token);
            this.tokenService.setAccessToken(res.access_token);
          }),
          map((res) =>
            AuthActions.loginSuccess({
              refreshToken: res.refresh_token,
            }),
          ),
          catchError((err) => of(AuthActions.loginFailure({ error: err.error?.message ?? err.message }))),
        ),
      ),
    ),
  );

  fetchAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.fetchAccessToken),
      switchMap((action: any) =>
        this.authService.fetchAccessToken(action.refreshToken).pipe(
          map((res: any) =>
            AuthActions.fetchAccessTokenSuccess({ accessToken: res.access_token }),
          ),
        ),
      ),
    ),
  );

  loginSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.appLogout),
        tap(() => {
          this.tokenService.clear();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );
}
