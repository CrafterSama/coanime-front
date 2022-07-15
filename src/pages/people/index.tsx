import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head';

const People = () => {
  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          People
        </h2>
      }>
      <Head>
        <title>Coanime.net - People</title>
      </Head>

      <div className="py-12">
        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              You're logged in!
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default People;
