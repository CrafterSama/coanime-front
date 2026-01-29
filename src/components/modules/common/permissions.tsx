import React from 'react';

import { useAuth } from '@/hooks/auth';
import { hasRole } from '@/utils/common';

export const Permissions = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <>
      {user &&
        (hasRole(user?.roles, 'administrator') ||
          hasRole(user?.roles, 'moderator') ||
          hasRole(user?.roles, 'writer')) && <>{children}</>}
    </>
  );
};
