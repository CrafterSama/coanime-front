import { DASHBOARD_ROLES, DASHBOARD_ROUTE } from '@/constants/common';
import { Role } from '@/types/auth/user-with-roles.types';

export const hasRole = (
  arr: Role[] | undefined,
  role: string
): Role | undefined => arr?.find(({ name }) => name === role);

export const canAccessDashboard = (roles: Role[] | undefined): boolean =>
  DASHBOARD_ROLES.some((role) => !!hasRole(roles, role));

export const isDashboardPath = (path: string): boolean =>
  path === DASHBOARD_ROUTE || path.startsWith(`${DASHBOARD_ROUTE}/`);
