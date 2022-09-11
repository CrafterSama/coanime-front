import { FC, useEffect } from 'react';

import { useRouter } from 'next/router';

import Footer from '@/components/Layouts/Footer';
import Navigation from '@/components/Layouts/WebNavigation';
import { useAuth } from '@/hooks/auth';

type WebLayoutProps = {
  children: React.ReactNode;
};

const WebLayout: FC<WebLayoutProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      document.getElementById('top').scrollIntoView();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
  }, [router]);

  const { user } = useAuth({ middleware: 'auth' });
  return (
    <div id="top" className="wraper flex flex-col min-h-screen">
      <header className="header">
        <Navigation user={user} />
      </header>
      <main className="flex flex-col flex-1 w-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default WebLayout;
