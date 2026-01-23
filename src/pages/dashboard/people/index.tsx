import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { createPeopleColumns } from '@/components/modules/people/columns';
import { DataTable } from '@/components/ui/data-table';
import Loading from '@/components/ui/Loading';
import { usePeople } from '@/hooks/people';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const People = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data = {}, isLoading } = usePeople({ page: String(page) });
  const { result, title, description } = data;
  const columns = React.useMemo(() => createPeopleColumns(), []);

  useEffect(() => {
    if (router?.query?.page) {
      return setPage(Number(router?.query?.page));
    }
    return setPage(1);
  }, [router?.query?.page]);

  const onPageChange = async (newPage: number) => {
    setPage(newPage);
    await router.push({
      pathname: '/dashboard/people',
      query: {
        page: newPage,
      },
    });
  };

  return (
    <AppLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

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
                People
              </h2>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
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
                        pageIndex: (result.current_page ?? page) - 1,
                        pageSize: result.per_page ?? 15,
                        total: result.total ?? 0,
                        lastPage: result.last_page ?? 1,
                        currentPage: result.current_page ?? page,
                        onPageChange,
                      }
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default People;
