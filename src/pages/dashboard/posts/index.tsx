import Head from 'next/head';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/posts/settings';
import Loading from '@/components/ui/Loading';
import { Rows, Table } from '@/components/ui/Table';
import { usePosts } from '@/hooks/posts';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const Posts = () => {
  const { data = {}, isLoading } = usePosts();
  const { data: posts = [] } = data;

  return (
    <AppLayout
      header={
        <div className="flex flex-row gap-4 justify-between items-center">
          <div className="flex flex-row gap-4">
            <div className="flex justify-center items-center">
              <Link href="/posts">
                <a className="bg-gray-200 text-orange-400 rounded">
                  <ChevronLeftIcon className="w-6 h-6" />
                </a>
              </Link>
            </div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Dashboard Articles
            </h2>
          </div>
          <Button>Crear</Button>
        </div>
      }
    >
      <Head>
        <title>Coanime.net - Articles Dashboard</title>
      </Head>
      <div className="py-12">
        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
            {isLoading && (
              <div className="flex justify-center content-center min-w-screen min-h-screen">
                <Loading size={16} />
              </div>
            )}
            {posts && (
              <Table columns={headers}>
                {posts?.map((row) => (
                  <Rows key={row.id} columns={headers} row={row} />
                ))}
              </Table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Posts;
