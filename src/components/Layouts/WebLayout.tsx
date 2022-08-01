import { FC } from 'react';

import { useAuth } from '@/hooks/auth';

import Navigation from './WebNavigation';

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
      <footer className="footer"></footer>
    </div>
  );
};

export default WebLayout;
