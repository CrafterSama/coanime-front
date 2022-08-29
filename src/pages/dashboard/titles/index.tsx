import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/titles/settings';
import { InputWithoutContext } from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { useTitles } from '@/hooks/titles';
import { FilterIcon, PlusIcon } from '@heroicons/react/outline';

const Titles = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const { data = {}, isLoading } = useTitles({ page, name });
  const { result, title, description } = data;

  const clearFilter = () => {
    setName('');
    setPage(1);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
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
        <div className="py-12">
          <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
            <div className="flex gap-2 justify-start items-center py-4">
              <InputWithoutContext
                type="search"
                placeholder="Buscar"
                className="w-[300px]"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FilterIcon
                className="w-6 h-6 text-orange-500 cursor-pointer"
                onClick={clearFilter}
              />
            </div>
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
    </>
  );
};

export default Titles;
