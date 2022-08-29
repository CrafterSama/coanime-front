import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/titles/settings';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { useTitles } from '@/hooks/titles';
import { PlusIcon } from '@heroicons/react/outline';

const Titles = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data = {}, isLoading } = useTitles({ page });
  const { result, title, description } = data;

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard"
          text="Lista de Titulos"
          rightElement={
            <Link href={`/dashboard/titles/create`}>
              <a className="font-semibold py-2 px-4 rounded-lg transition-colors border-2 text-orange-500 bg-orange-100 border-orange-500 hover:bg-orange-200 flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" /> Crear
              </a>
            </Link>
          }
        />
      }
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="py-12">
        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
            {isLoading && (
              <div className="flex justify-center content-center min-w-screen min-h-screen">
                <Loading size={16} />
              </div>
            )}
            {result?.data && (
              <>
                <Table columns={headers}>
                  {result?.data?.map((row) => (
                    <Rows key={row.id} columns={headers} row={row} />
                  ))}
                </Table>
                <Paginator page={page} setPage={setPage} data={result} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Titles;
