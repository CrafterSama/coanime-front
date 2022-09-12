import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/posts/settings';
import { InputWithoutContext } from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { usePosts } from '@/hooks/posts';
import { PlusIcon } from '@heroicons/react/outline';

const Posts = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const { data = {}, isLoading } = usePosts({ page, name });
  const { data: posts = [] } = data;

  return (
    <>
      <Head>
        <title>Coanime.net - Lista de Articulos</title>
      </Head>
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
        <div className="py-12">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start py-4">
              <InputWithoutContext
                placeholder="Buscar"
                className="w-[300px]"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
              {isLoading && (
                <div className="flex justify-center content-center min-w-screen min-h-screen">
                  <Loading size={16} />
                </div>
              )}
              {posts && (
                <>
                  <Table columns={headers}>
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
    </>
  );
};

export default Posts;
