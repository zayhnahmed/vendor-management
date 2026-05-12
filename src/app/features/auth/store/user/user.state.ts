import { AuthUser } from '../../models/auth-user.model';

export interface AuthUserState {
  user: AuthUser | null;
  loading: boolean;
  loaded: boolean;
}

export const initialState: AuthUserState = {
  user: null,
  loading: false,
  loaded: false,
};
