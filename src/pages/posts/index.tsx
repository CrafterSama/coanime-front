import { useQuery } from 'react-query';

import Head from 'next/head';

import WebLayout from '@/components/Layouts/WebLayout';
import { headers } from '@/components/modules/posts/settings';
import Loading from '@/components/ui/Loading';
import { Rows, Table } from '@/components/ui/Table';
import { getArticlesData } from '@/hooks/posts';

const Posts = ({ articlesData }) => {
  const { data = {}, isLoading } = useQuery(['articles'], getArticlesData, {
    initialData: articlesData,
  });
  const { data: posts = [] } = data;

  return (
    <WebLayout>
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
    </WebLayout>
  );
};

export const getServerSideProps = async () => {
  const response = await getArticlesData();

  if (response.data.code === 404) {
    return {
      notFound: true,
    };
  }

  const articlesData = response.data;

  return {
    props: {
      articlesData,
      revalidate: 5 * 60,
    },
  };
};

export default Posts;
