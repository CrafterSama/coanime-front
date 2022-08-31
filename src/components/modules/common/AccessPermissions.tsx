import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { useAuth } from '@/hooks/auth';
import { hasRole } from '@/utils/common';

const AccessPermissions = (children) => {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' });

  useEffect(() => {
    if (user && user?.roles.length === 1 && hasRole(user?.roles, 'user')) {
      toast.error('You do not have permission to access this page');
      router.push('/');
    }
  }, []);

  return <>{children}</>;
};

export default AccessPermissions;
