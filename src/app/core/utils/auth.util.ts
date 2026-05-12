import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../enums/user.enum';

export function getUserRole(token: string | null): UserRole | null {
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export function getOrganizationId(token: string | null): string | null {
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.organizationId ?? null;
  } catch {
    return null;
  }
}
