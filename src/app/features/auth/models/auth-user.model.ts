import { UserRole } from '../../../core/enums/user.enum';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;

  companyName: string;
  phone: string;
  vendorUid: string;

  firstLogin: boolean;
  tempPassword: boolean;

  passwordChangedAt: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface AuthUserApiResponse {
  success: boolean;
  user: AuthUser;
}
