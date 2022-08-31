import { useAuth } from '@/hooks/auth';
import { hasRole } from '@/utils/common';

export const AdminPermissions = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <>{user && hasRole(user?.roles, 'administrator') && <>{children}</>}</>
  );
};
