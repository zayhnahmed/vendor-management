export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  requiresPasswordChange: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  requiresPasswordChange: false,
  loading: false,
  error: null,
};