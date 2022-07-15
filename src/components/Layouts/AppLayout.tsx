import Navigation from '@/components/Layouts/Navigation';
import { useAuth } from '@/hooks/auth';
import Aside from '@/components/ui/Aside';
import { useRouter } from 'next/router';

const AppLayout = ({ header, children }) => {
  const { user } = useAuth({ middleware: 'auth' });

  return (
    <div className="flex flex-row min-h-screen">
      <Aside />
      <main className="flex flex-col flex-1 w-auto">
        <Navigation user={user} />
        {/*<header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>*/}
        <section>{children}</section>
      </main>
    </div>
  );
};

export default AppLayout;
