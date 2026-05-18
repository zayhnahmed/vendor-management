import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SKIP_AUTH } from '../../../../core/http/http-context.tokens';
import { AuthUserApiResponse } from '../../models/auth-user.model';

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);

  get currentUser() {
    return this.http.get<AuthUserApiResponse>('/auth/profile');
  }

  login(username: string, password: string) {
    return this.http.post<AuthTokenResponse>(
      '/auth/login',
      {
        email: username,
        password,
      },
      {
        context: new HttpContext().set(SKIP_AUTH, true),
      },
    );
  }

  fetchAccessToken(refreshToken: string) {
    return this.http.post<AuthTokenResponse>(
      '/auth/refresh',
      {
        refresh_token: refreshToken,
      },
      {
        context: new HttpContext().set(SKIP_AUTH, true),
      },
    );
  }
}
