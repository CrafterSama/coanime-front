import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import { useQuery } from 'react-query';

import Head from 'next/head';

import WebLayout from '@/components/Layouts/WebLayout';
import BroadcastToday from '@/components/modules/home/components/BroadcastToday';
import OtherNews from '@/components/modules/home/components/OtherNews';
import RecentPosts from '@/components/modules/home/components/RecentPosts';
import TopSlider from '@/components/modules/home/components/TopSlider';
import UpcomingSeries from '@/components/modules/home/components/UpcomingSeries';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getHomeData } from '@/services/home';
import { getArticlesData, getArticlesJapan } from '@/services/posts';
import { PlusSmIcon } from '@heroicons/react/outline';

const Home = ({ homeData, articlesData, articlesJapan, errors }) => {
  const { data, isLoading } = useQuery(['homeData'], getHomeData, {
    initialData: homeData,
  });
  const [articles, setArticles] = useState([]);
  const [loadArticles, setLoadArticles] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (articlesData) {
      setArticles([...articles, ...articlesData?.data]);
    }
    if (errors) {
      toast.error(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moreArticles = async () => {
    setLoadArticles(true);
    const response = await getArticlesData({ page });
    const oldArticles: any[] = articles;
    const newArticles: any[] = response?.data?.data;
    setArticles([...oldArticles, ...newArticles]);
    setLoadArticles(false);
  };

  useEffect(() => {
    moreArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading showFancySpiner size={20} />
        </div>
      )}
      <Head>
        <title>{data?.title}</title>
        <meta name="description" content={data?.description} />
        <meta name="keywords" content={data?.keywords} />
        <meta name="author" content="@coanime" />
        <meta property="og:title" content={data?.title} />
        <meta property="og:description" content={data?.description} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="Coanime" />
        <meta property="og:url" content="https://front.coanime.net" />
        <meta
          property="og:image"
          content="https://coanime.s3.us-east-2.amazonaws.com/coanime-logo-default.svg"
        />
        <meta
          property="og:image:secure_url"
          content="https://coanime.s3.us-east-2.amazonaws.com/coanime-logo-default.svg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.title} />
        <meta name="twitter:description" content={data?.description} />
        <meta name="twitter:site" content="@coanime" />
        <meta
          name="twitter:image:src"
          content="https://coanime.s3.us-east-2.amazonaws.com/coanime-logo-default.svg"
        />
        <meta name="twitter:creator" content="@coanime" />
        <meta name="referrer" content="default" />
        <meta property="fb:pages" content="127729317274121" />
        <meta content="all, index, follow" name="robots" />
      </Head>

      <Section>
        <TopSlider relevants={data?.relevants} />
      </Section>
      <Section withContainer>
        <SectionTitle title="Recientes" subtitle="Noticias Recientes" />
        <RecentPosts posts={data?.result} />
        <div className="w-full flex justify-end items-center mt-2 px-4">
          <a
            className="flex flex-row items-center text-orange-500"
            href="#news"
          >
            <PlusSmIcon className="w-6 h-6 text-orange-400" />
            Mas Noticias
          </a>
        </div>
      </Section>
      <Section withContainer>
        <SectionTitle title="Broadcast" subtitle="Animes En Emisión hoy" />
        <BroadcastToday broadcast={data?.broadcast} />
      </Section>
      <Section withContainer>
        <SectionTitle title="" subtitle="Próximos Estrenos" />
        <UpcomingSeries upcoming={data?.upcoming} />
      </Section>
      <Section className="bg-indigo-50 bg-opacity-50 shadow-inner py-4">
        <Section withContainer>
          <SectionTitle
            title="Japón y Cultura"
            subtitle="Articulos relacionados con la Cultura de"
            fancyText="Japón"
          />
          <OtherNews articles={articlesJapan?.data} />
        </Section>
      </Section>
      <Section withContainer id="news">
        <SectionTitle title="News" subtitle="Otras Noticias" />
        <OtherNews articles={articles} />
        <div className="flex justify-center">
          <Button onClick={() => setPage(page + 1)}>
            {loadArticles ? (
              <CgSpinner className="animate-spin" />
            ) : (
              'Mas Articulos'
            )}
          </Button>
        </div>
      </Section>
    </WebLayout>
  );
};

export async function getServerSideProps() {
  const page = 1;
  let response = null;
  let articles = null;
  let japan = null;
  let errors = null;
  try {
    response = await getHomeData();
    articles = await getArticlesData({ page });
    japan = await getArticlesJapan({ page });
  } catch (error) {
    errors = error.response.data.message.text;
  }

  return {
    props: {
      homeData: response?.data,
      articlesData: articles?.data,
      articlesJapan: japan?.data,
      errors,
    },
  };
}

export default Home;
