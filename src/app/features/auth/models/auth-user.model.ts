import { UserRole } from '../../../core/enums/user.enum';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  companyName: string;
  phone?: string;
  vendorUid?: string;
  createdAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  requiresPasswordChange: boolean;
  isFirstLogin: boolean;
  user: AuthUser;
}

export interface AuthUserApiResponse {
  success: boolean;
  vendor: AuthUser;
}
