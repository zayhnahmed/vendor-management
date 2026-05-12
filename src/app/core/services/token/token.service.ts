import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setAccessToken(token: string) {
    // sessionStorage.setItem('access_token', token);
    localStorage.setItem('access_token', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }

  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
