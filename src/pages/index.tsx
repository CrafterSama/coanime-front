import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

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
import { PlusSmallIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

const Home = ({ homeDataSSR }) => {
  const [page, setPage] = useState(1);
  const { isLoading, error }: any = useQuery(['homeData'], getHomeData);
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: errorArticles,
  } = useQuery(['articlesData', page], () => getArticlesData({ page }));
  const {
    data: articlesJapan,
    isLoading: loadingJapan,
    error: errorJapan,
  } = useQuery(['japanData', page], () => getArticlesJapan({ page }));
  const [articles, setArticles] = useState([]);
  const [loadArticles, setLoadArticles] = useState(false);

  useEffect(() => {
    if (articlesData && page) {
      setArticles([...articles, ...articlesData.data.data]);
    }
    if (error || errorArticles || errorJapan) {
      toast.error(error || errorArticles || errorJapan);
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
      <Head>
        <title>{homeDataSSR?.title}</title>
        <meta name="title" content={homeDataSSR?.title} />
        <meta name="description" content={homeDataSSR?.description} />
        <meta name="keywords" content={homeDataSSR?.keywords} />
        <meta name="author" content="@coanime" />
        <meta property="og:title" content={homeDataSSR?.title} />
        <meta property="og:description" content={homeDataSSR?.description} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="Coanime" />
        <meta property="og:url" content="https://coanime.net" />
        <meta property="og:image" content={homeDataSSR?.image} />
        <meta property="og:image:secure_url" content={homeDataSSR?.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeDataSSR?.title} />
        <meta name="twitter:description" content={homeDataSSR?.description} />
        <meta name="twitter:site" content="@coanime" />
        <meta name="twitter:image:src" content={homeDataSSR?.image} />
        <meta name="twitter:creator" content="@coanime" />
        <meta name="referrer" content="default" />
        <meta property="fb:pages" content="127729317274121" />
        <meta content="all, index, follow" name="robots" />
      </Head>

      <Section>
        <TopSlider relevants={homeDataSSR?.relevants} />
      </Section>
      <Section withContainer>
        <SectionTitle title="Recientes" subtitle="Noticias Recientes" />
        <RecentPosts posts={homeDataSSR?.result} />
        <div className="w-full flex justify-end items-center mt-2 px-4">
          <a
            className="flex flex-row items-center text-orange-500"
            href="#news">
            <PlusSmallIcon className="w-6 h-6 text-orange-400" />
            Mas Noticias
          </a>
        </div>
      </Section>
      <Section withContainer>
        <SectionTitle title="Broadcast" subtitle="Animes En Emisión hoy" />
        <BroadcastToday broadcast={homeDataSSR?.broadcast} />
      </Section>
      <Section withContainer>
        <SectionTitle
          title=""
          subtitle="Próximos Estrenos"
          actionLink="/ecma/titulos/estrenos"
          justify="justify-between"
        />
        <UpcomingSeries upcoming={homeDataSSR?.upcoming} />
      </Section>
      {isLoading || articlesLoading || loadingJapan ? (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading showFancySpiner size={20} />
        </div>
      ) : (
        <>
          <Section className="bg-indigo-50 shadow-inner py-4">
            <Section withContainer>
              <SectionTitle
                title="Cultura Otaku"
                subtitle="Occidental y de Japón"
                subTitleBackground="bg-indigo-50"
              />
              <OtherNews articles={articlesJapan?.data.data} />
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
        </>
      )}
    </WebLayout>
  );
};

export async function getServerSideProps() {
  const { data: homeData } = await getHomeData();

  return {
    props: {
      homeDataSSR: homeData,
    },
  };
}

export default Home;
