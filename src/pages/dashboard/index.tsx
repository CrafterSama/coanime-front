import Head from 'next/head';
import Link from 'next/link';

import { NewspaperIcon } from '@/components/icons';
import AppLayout from '@/components/Layouts/AppLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/hooks/auth';
import { useDashboard } from '@/hooks/dashboard';
import { PhotographIcon, TagIcon } from '@heroicons/react/outline';

const Dashboard = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const { data, isLoading } = useDashboard();

  return (
    <>
      <Head>
        <title>Coanime.net - Dashboard</title>
      </Head>
      <AppLayout header={<SectionHeader backlink="/" text="Dashboard" />}>
        <div className="py-12">
          <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 bg-white sm:rounded-lg">
              <div className="flex flex-row gap-8">
                <div className="w-1/4 p-6 bg-white shadow-lg rounded-lg relative">
                  <h2 className="text-2xl font-bold">Total Artículos</h2>
                  <p className="text-gray-500">
                    You have{' '}
                    <span className="font-bold">{data?.postsCount}</span> posts
                  </p>
                  <div className="absolute -top-2 -right-2 p-4 bg-orange-400 rounded-full shadow">
                    <Link href="/dashboard/posts?page=1" className="text-white">
                      <NewspaperIcon className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
                <div className="w-1/4 p-6 bg-white shadow-lg rounded-lg relative">
                  <h2 className="text-2xl font-bold">Total Títulos</h2>
                  <p className="text-gray-500">
                    You have{' '}
                    <span className="font-bold">{data?.titlesCount}</span> posts
                  </p>
                  <div className="absolute -top-2 -right-2 p-4 bg-teal-600 rounded-full shadow">
                    <Link
                      href="/dashboard/titles?page=1"
                      className="text-white">
                      <PhotographIcon className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
                <div className="w-1/4 p-6 bg-white shadow-lg rounded-lg relative">
                  <h2 className="text-2xl font-bold">Post mas visitado</h2>
                  <p className="text-gray-500">
                    <span className="font-bold">
                      {data?.mostVisitedPost?.title}
                    </span>{' '}
                    con{' '}
                    <span className="font-bold">
                      {data?.mostVisitedPost?.viewCounter}
                    </span>{' '}
                    Vistas
                  </p>
                  <div className="absolute -top-2 -right-2 p-4 bg-violet-400 rounded-full shadow">
                    <Link
                      href={`/posts/${data?.mostVisitedPost?.slug}`}
                      className="text-white">
                      <NewspaperIcon className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
                <div className="w-1/4 p-6 bg-white shadow-lg rounded-lg relative">
                  <h2 className="text-2xl font-bold">
                    Categoría con mas Posts
                  </h2>
                  <p className="text-gray-500">
                    <span className="font-bold">
                      {data?.mostPostsCategory?.name}
                    </span>{' '}
                    con{' '}
                    <span className="font-bold">
                      {data?.mostPostsCategory.postsCount}
                    </span>{' '}
                    posts
                  </p>
                  <div className="absolute -top-2 -right-2 p-4 bg-blue-400 rounded-full shadow">
                    <Link
                      href={`/categorias/${data?.mostPostsCategory.slug}`}
                      className="text-white">
                      <TagIcon className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                Hola <span className="font-bold">{user?.username}</span>,
                bienvenido al dashboard de Coanime.net
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Dashboard;
