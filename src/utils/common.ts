import { Role } from '@/types/auth/user-with-roles.types';

export const hasRole = (arr: Role[] | undefined, role: string): Role | undefined =>
  arr?.find(({ name }) => name === role);
