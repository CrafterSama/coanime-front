import { useEffect } from 'react';
import toast from 'react-hot-toast';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Navigation from '@/components/Layouts/Navigation';
import Aside from '@/components/ui/Aside';
import { useAuth } from '@/hooks/auth';
import { hasRole } from '@/utils/common';

const AppLayout = ({ header, children }) => {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' });

  useEffect(() => {
    if (user && user?.roles.length === 1 && hasRole(user?.roles, 'user')) {
      toast.error('You do not have permission to access this page');
      router.push('/');
    }
  }, [user]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div id="top" className="flex flex-row min-h-screen">
        <Aside />
        <main className="flex flex-col flex-1 w-auto">
          <Navigation user={user} />
          {
            <header className="bg-white">
              <div className="py-6 px-8">{header}</div>
            </header>
          }
          <section>{children}</section>
        </main>
      </div>
    </>
  );
};

export default AppLayout;
