import Head from 'next/head';

import AppLayout from '@/components/Layouts/AppLayout';
import SectionHeader from '@/components/ui/SectionHeader';

const Dashboard = () => {
  return (
    <AppLayout header={<SectionHeader backlink="/" text="Dashboard" />}>
      <Head>
        <title>Coanime.net - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              Dashboard
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
