import { useQuery } from 'react-query';

import Head from 'next/head';
import { GetStaticProps } from 'next/types';

import WebLayout from '@/components/Layouts/WebLayout';
import BroadcastToday from '@/components/modules/home/components/BroadcastToday';
import OtherNews from '@/components/modules/home/components/OtherNews';
import RecentPosts from '@/components/modules/home/components/RecentPosts';
import TopSlider from '@/components/modules/home/components/TopSlider';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getCategory } from '@/services/categories';
import { scrollWindowToTop } from '@/utils/scroll';

const Categories = ({ categoryData }) => {
  const { data = {}, isLoading } = useQuery(
    ['categories', categoryData],
    getCategory,
    { initialData: categoryData }
  );
  const { title = '', description = '', keywords = '', relevants = [] } = data;

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading showFancySpiner size={20} />
        </div>
      )}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Section>
        <TopSlider relevants={relevants} />
      </Section>
      <Section withContainer>
        <SectionTitle title="Recientes" subtitle="Noticias Recientes" />
        <RecentPosts posts={data?.result} />
      </Section>
      <Section withContainer>
        <SectionTitle title="Broadcast" subtitle="Animes En Emisión hoy" />
        <BroadcastToday />
      </Section>
      <Section withContainer>
        <SectionTitle title="News" subtitle="Otras Noticias" />
        <OtherNews />
      </Section>
    </WebLayout>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await getCategory(String(params?.category) as string);

  if (response?.data?.code === 404) {
    return {
      notFound: true,
    };
  }

  const categoryData = response.data;

  return {
    props: {
      categoryData,
      revalidate: 5 * 60,
    },
  };
};

export default Categories;
