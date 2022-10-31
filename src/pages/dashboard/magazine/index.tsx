import { useState } from 'react';

import Head from 'next/head';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/magazine/settings';
import Loading from '@/components/ui/Loading';
import { Rows, Table } from '@/components/ui/Table';
import { useMagazines } from '@/hooks/magazine';

const Magazine = () => {
  const [page, setPage] = useState('');
  const { data = {}, isLoading } = useMagazines({ page });
  const { result, title, description } = data;

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Magazine
        </h2>
      }>
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
              <Table columns={headers}>
                {result?.data?.map((row) => (
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

export default Magazine;
