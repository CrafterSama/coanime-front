import Navigation from '@/components/Layouts/Navigation';
import { useAuth } from '@/hooks/auth';
import { Logotype } from '@/components/ApplicationLogo';
import MenuLink from '@/components/MenuLink';
import { useRouter } from 'next/router';

const AppLayout = ({ header, children }) => {
  const { user } = useAuth({ middleware: 'auth' });
  const router = useRouter();

  return (
    <div className="flex flex-row min-h-screen">
      <aside className="w-auto border-r border-gray-200">
        <div className="flex flex-col gap-4 m-auto">
          <div className="w-auto h-20 p-4 rounded-full self-center ">
            <Logotype
              logoColor="#FE6A00"
              lettersColor="#FE6A00"
              className="h-10 fill-current"
            />
          </div>
          <ul className="w-full">
            <MenuLink
              href="/dashboard"
              active={router.pathname === '/dashboard'}>
              Dashboard
            </MenuLink>
          </ul>
        </div>
      </aside>
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
  /*<div className="min-h-screen bg-gray-100">


      <main>{children}</main>
    </div>*/
};

export default AppLayout;
