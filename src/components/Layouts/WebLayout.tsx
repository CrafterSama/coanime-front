import { FC } from 'react';

import Navigation from '@/components/Layouts/WebNavigation';
import Footer from '@/components/ui/Footer';
import { useAuth } from '@/hooks/auth';

type WebLayoutProps = {
  children: React.ReactNode;
};

const WebLayout: FC<WebLayoutProps> = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <div className="wraper flex flex-col min-h-screen">
      <header className="header">
        <Navigation user={user} />
      </header>
      <main className="flex flex-col flex-1 w-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default WebLayout;
