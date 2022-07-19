import AppLayout from '@/components/Layouts/AppLayout';
import { Rows, Table } from '@/components/ui/Table';
import Head from 'next/head';
import { headers } from '@/components/modules/posts/settings';
import { usePosts } from '@/hooks/posts';
import Loading from '@/components/ui/Loading';

const Posts = () => {
  const { data = {}, isLoading, isError } = usePosts();
  const { data: posts = [] } = data;

  return (
    <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Posts</h2>}>
      <Head>
        <title>Coanime.net - Posts</title>
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
    </AppLayout>
  );
};

export default Posts;
