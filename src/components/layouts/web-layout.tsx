import { FC, useEffect } from 'react';

import { useRouter } from 'next/router';

import Footer from '@/components/layouts/footer';
import Navigation from '@/components/layouts/web-navigation';
import { useAuth } from '@/hooks/auth';

type WebLayoutProps = {
  children: React.ReactNode;
};

const WebLayout: FC<WebLayoutProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      const topElement = document.getElementById('top');
      if (topElement) {
        topElement.scrollIntoView();
      }
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
