import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SKIP_AUTH } from '../../../../core/http/http-context.tokens';
import { AuthUserApiResponse, LoginResponse } from '../../models/auth-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);

  get currentUser() {
    return this.http.get<AuthUserApiResponse>('/auth/profile');
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(
      '/auth/login',
      { email: username, password },
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }

  logout(refreshToken: string) {
    return this.http.post('/auth/logout', { refresh_token: refreshToken });
  }

  fetchAccessToken(refreshToken: string) {
    return this.http.post(
      '/auth/refresh',
      { refresh_token: refreshToken },
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }

  executePasswordAction(token: string, newPassword: string) {
    return this.http.post<LoginResponse>(
      '/auth/password/execute',
      { token, newPassword },
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }
}
