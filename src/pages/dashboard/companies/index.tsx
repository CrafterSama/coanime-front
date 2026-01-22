import { useState } from 'react';

import Head from 'next/head';

import AppLayout from '@/components/Layouts/AppLayout';
import { headers } from '@/components/modules/entities/settings';
import Loading from '@/components/ui/Loading';
import { Rows, Table } from '@/components/ui/Table';
import { useCompanies } from '@/hooks/companies';
import { RowRender } from '@/components/ui/RowRender';
import { Show } from '@/components/ui/Show';

/*const Test = (props) => {
  const { name } = props;
  return (
    <ul className="flex flex-col gap-2 justify-start items-start">
      <li>{name}</li>
    </ul>
  );
};*/
const Companies = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState('');
  const { data = {}, isLoading } = useCompanies({ page });
  const { result, title, description } = data;
  //const results = { ...result, columns: headers };

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Entities
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
            <Show condition={Boolean(result?.data)}>
              <Table columns={headers}>
                <RowRender
                  data={result?.data}
                  columns={headers}
                  component={Rows}
                />
              </Table>
            </Show>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Companies;
