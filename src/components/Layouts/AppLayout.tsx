import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Navigation from '@/components/Layouts/Navigation';
import Aside from '@/components/ui/Aside';
import { hasRole } from '@/utils/common';

interface AppLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

const AppLayout = ({ header, children }: AppLayoutProps) => {
  const router = useRouter();
  const [isTiny, setIsTiny] = useState(false);
  const user: any = {};

  useEffect(() => {
    if (user && user?.roles?.length === 1 && hasRole(user?.roles, 'user')) {
      toast.error('You do not have permission to access this page');
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div id="top" className="flex flex-row min-h-screen">
        <Aside isTiny={isTiny} />
        <main className="flex flex-col flex-1 w-auto">
          <Navigation user={user} menuActionButton={() => setIsTiny(!isTiny)} />
          <header className="bg-white">
            <div className="py-6 px-8">{header}</div>
          </header>
          <section>{children}</section>
        </main>
      </div>
    </>
  );
};

export default AppLayout;
