import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { createTitleColumns } from '@/components/modules/titles/columns';
import { DataTable } from '@/components/ui/data-table';
import Loading from '@/components/ui/Loading';
import { useTitles } from '@/hooks/titles';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

const Titles = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>();
  const [name, setName] = useState<any>();
  const { data = {}, isLoading } = useTitles({ page, name });
  const { result, title, description } = data;
  const columns = React.useMemo(() => createTitleColumns(), []);

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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <AppLayout>
        <div className="p-4">
          <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-row gap-4 justify-between items-center mb-4">
              <div className="flex flex-row gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="bg-gray-200 text-orange-400 rounded p-1 hover:bg-gray-300 transition-colors">
                  <ChevronLeftIcon className="w-6 h-6" />
                </Link>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                  Lista de Titulos
                </h2>
              </div>
              <Link
                href={`/dashboard/titles/create`}
                className="font-semibold py-2 px-4 rounded-lg transition-colors text-orange-500 bg-orange-100 hover:bg-orange-200 shadow-sm hover:shadow-md flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            </div>

            <div className="bg-white overflow-auto min-h-screen shadow-sm rounded-lg p-4">
              {isLoading ? (
                <div className="flex justify-center content-center min-h-screen">
                  <Loading size={16} />
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={result?.data || []}
                  searchKey="name"
                  searchPlaceholder="Buscar por nombre..."
                  pagination={
                    result
                      ? {
                          pageIndex: (result.current_page ?? (page ?? 1)) - 1,
                          pageSize: result.per_page ?? 15,
                          total: result.total ?? 0,
                          lastPage: result.last_page ?? 1,
                          currentPage: result.current_page ?? (page ?? 1),
                          onPageChange: (newPage: number) => {
                            setPage(newPage);
                          },
                        }
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Titles;
