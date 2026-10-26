import React from 'react';

import { useAuth } from '@/hooks/auth';
import { canAccessDashboard } from '@/utils/common';

export const Permissions = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return (
    <>{user && canAccessDashboard(user?.roles) && <>{children}</>}</>
  );
};
