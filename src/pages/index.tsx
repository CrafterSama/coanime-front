import Head from 'next/head';

import WebLayout from '@/components/Layouts/WebLayout';
import RecentPosts from '@/components/modules/home/components/RecentPosts';
import TopSlider from '@/components/modules/home/components/TopSlider';
import Loading from '@/components/ui/Loading';
import { useHome } from '@/hooks/home';
import SectionTitle from '@/components/ui/SectionTitle';
import BroadcastToday from '@/components/modules/home/components/BroadcastToday';

export default function Home() {
  const { data = {}, isLoading } = useHome();
  const { title = '', description = '', keywords = '', relevants = [] } = data;

  console.log(data);

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <section className="mb-4">
        <TopSlider relevants={relevants} />
      </section>
      <section className="container max-w-7xl mx-auto">
        <SectionTitle title="Recientes" subtitle="Noticias Recientes" />
        <RecentPosts posts={data?.result} />
      </section>
      <section className="container max-w-7xl mx-auto">
        <SectionTitle title="Broadcast" subtitle="En Emisión hoy" />
        <BroadcastToday />
      </section>
    </WebLayout>
  );
}
