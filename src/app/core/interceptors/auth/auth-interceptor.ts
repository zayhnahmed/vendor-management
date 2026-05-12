import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth/auth.service';
import { TokenService } from '../../services/token/token.service';
import { SKIP_AUTH } from '../../http/http-context.tokens';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  // ✅ Check context
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();

  let authReq = req;

  if (accessToken) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return handle401Error(req, next, authService, tokenService);
      }

      return throwError(() => error);
    }),
  );
};

// 🔑 attach token
function addToken(req: HttpRequest<any>, token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 🔥 refresh logic
function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenService: TokenService,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => 'No refresh token');
    }

    return authService.fetchAccessToken(refreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;

        const newAccessToken = res.access_token;
        tokenService.setAccessToken(newAccessToken);
        refreshTokenSubject.next(newAccessToken);
        return next(addToken(req, newAccessToken));
      }),

      catchError((err) => {
        isRefreshing = false;
        tokenService.clear();
        return throwError(() => err);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => next(addToken(req, token!))),
    );
  }
}
