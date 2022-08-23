import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/posts/settings';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { usePosts } from '@/hooks/posts';
import { getPosts } from '@/services/posts';
import { PlusIcon } from '@heroicons/react/outline';

const Posts = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: queryData = {}, isLoading } = usePosts({ page });
  const [data, setData] = useState(queryData);
  const [reloadingTable, setReloadingTable] = useState(false);
  const { data: posts = [] } = data;

  useEffect(() => {
    if (queryData) {
      setData(queryData);
    }
  }, []);

  const onPageChange = async () => {
    await router.push({
      pathname: '/dashboard/posts',
      query: {
        page,
      },
    });
    const response = await getPosts({ page });
    setData(response);
    setReloadingTable(false);
  };

  useEffect(() => {
    setReloadingTable(true);
    onPageChange();
  }, [page]);

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard"
          text="Lista de Articulos"
          rightElement={
            <Link href={`/dashboard/posts/create`}>
              <a className="font-semibold py-2 px-4 rounded-lg transition-colors border-2 text-orange-500 bg-orange-100 border-orange-500 hover:bg-orange-200 flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" /> Crear
              </a>
            </Link>
          }
        />
      }
    >
      <Head>
        <title>Coanime.net - Lista de Articulos</title>
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
              <>
                <Table columns={headers}>
                  {reloadingTable && (
                    <div className="flex justify-center content-center min-w-screen min-h-screen">
                      <Loading showFancySpiner={false} size={16} />
                    </div>
                  )}
                  {posts?.map((row) => (
                    <Rows key={row.id} columns={headers} row={row} />
                  ))}
                </Table>
                <Paginator page={page} setPage={setPage} data={data} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Posts;
