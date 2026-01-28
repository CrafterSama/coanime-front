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
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/page-skeleton';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { ShowAdvanced } from '@/components/ui/Show';
import { RecentArticlesSkeleton } from '@/components/ui/skeletons/recent-articles-skeleton';
import { getHomeData } from '@/services/home';
import { getArticlesData, getArticlesJapan } from '@/services/posts';
import { useQuery } from '@tanstack/react-query';

const Home = ({ homeDataSSR }: { homeDataSSR: any }) => {
  const [page, setPage] = useState(1);
  const { isLoading, error }: any = useQuery(['homeData'], getHomeData);
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: errorArticles,
  } = useQuery(['articlesData', page], () => getArticlesData({ page }), {
    retry: false,
    onError: (error: any) => {
      if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        console.error('Error de red al cargar artículos:', error);
      }
    },
  });
  const {
    data: articlesJapan,
    isLoading: loadingJapan,
    error: errorJapan,
  } = useQuery(['japanData', page], () => getArticlesJapan({ page }));
  const [articles, setArticles] = useState<any[]>([]);
  const [loadArticles, setLoadArticles] = useState(false);

  useEffect(() => {
    if (articlesData && page) {
      setArticles([...articles, ...articlesData.data.data]);
    }
    if (error) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'Error al cargar datos';
      toast.error(errorMessage);
    }
    if (errorArticles) {
      const errorMessage =
        errorArticles?.message ||
        errorArticles?.response?.data?.message ||
        'Error al cargar artículos';
      toast.error(errorMessage);
    }
    if (errorJapan) {
      const errorMessage =
        (errorJapan as any)?.message ||
        (errorJapan as any)?.response?.data?.message ||
        'Error al cargar artículos de Japón';
      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, errorArticles, errorJapan, articlesData, page]);

  const moreArticles = async () => {
    setLoadArticles(true);
    try {
      const response = await getArticlesData({ page });
      const oldArticles: any[] = articles;
      const newArticles: any[] = response?.data?.data;
      setArticles([...oldArticles, ...newArticles]);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        toast.error('Error de conexión. Verifica que la API esté disponible.');
      } else {
        toast.error('Error al cargar artículos. Intenta de nuevo.');
      }
    } finally {
      setLoadArticles(false);
    }
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
      <ShowAdvanced
        when={homeDataSSR?.result?.length > 0}
        whenIsTrue={<RecentPosts posts={homeDataSSR?.result} />}
        whenIsFalse={<RecentArticlesSkeleton />}
      />
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
        <PageSkeleton sections={3} />
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
