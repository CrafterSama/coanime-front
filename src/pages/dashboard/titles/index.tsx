import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/titles/settings';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { useTitles } from '@/hooks/titles';
import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';

const Titles = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>();
  const [name, setName] = useState<any>();
  const { data = {}, isLoading } = useTitles({ page, name });
  const { result, title, description } = data;

  useEffect(() => {
    if (router?.query?.page) {
      return setPage(Number(router?.query?.page));
    }
    return setPage(1);
  }, [router?.query?.page]);

  const onPageChange = async () => {
    await router.push({
      pathname: '/dashboard/titles',
      query: {
        page,
      },
    });
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

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
              <Link
                href={`/dashboard/titles/create`}
                className="font-semibold py-2 px-4 rounded-lg transition-colors border-2 text-orange-500 bg-orange-100 border-orange-500 hover:bg-orange-200 flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            }
          />
        }>
        <div className="py-12">
          <div className="max-w-9xl mx-auto px-4  sm:px-6 lg:px-8">
            <div className="flex gap-2 justify-start items-center py-4">
              <Input
                type="search"
                placeholder="Buscar"
                className="w-[300px]"
                defaultValue={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <FunnelIcon
                className="w-6 h-6 text-orange-500 cursor-pointer"
                onClick={clearFilter}
              />
            </div>
            <div className="bg-white overflow-auto min-h-screen shadow-lg sm:rounded-lg">
              {isLoading && (
                <div className="flex justify-center content-center min-w-screen min-h-screen">
                  <Loading size={16} />
                </div>
              )}
              {result?.data && (
                <>
                  <Table columns={headers}>
                    {result?.data?.map((row: any) => (
                      <Rows key={row.id} columns={headers} row={row} />
                    ))}
                  </Table>
                  <Paginator page={page ?? 1} setPage={setPage} data={result} />
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
