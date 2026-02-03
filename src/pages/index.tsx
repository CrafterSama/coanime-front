import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import Head from 'next/head';

import WebLayout from '@/components/layouts/web-layout';
import BroadcastToday from '@/components/modules/home/components/broadcast-today';
import OtherNews from '@/components/modules/home/components/other-news';
import RecentPosts from '@/components/modules/home/components/recent-posts';
import TopSlider from '@/components/modules/home/components/top-slider';
import UpcomingSeries from '@/components/modules/home/components/upcoming-series';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/page-skeleton';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { ShowAdvanced } from '@/components/ui/show';
import { RecentArticlesSkeleton } from '@/components/ui/skeletons/recent-articles-skeleton';
import { getHomeData } from '@/services/home';
import { getArticlesData, getArticlesJapan } from '@/services/posts';
import { useQuery } from '@tanstack/react-query';

const Home = ({ homeDataSSR }: { homeDataSSR: any }) => {
  const [page, setPage] = useState(1);
  const lastAppendedPageRef = useRef<number>(0);

  const { isLoading, error }: any = useQuery(['homeData'], getHomeData);
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: errorArticles,
  } = useQuery(['articlesData', page], () => getArticlesData({ page }), {
    retry: false,
    onError: (err: any) => {
      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        console.error('Error de red al cargar artículos:', err);
      }
    },
  });
  const {
    data: articlesJapan,
    isLoading: loadingJapan,
    error: errorJapan,
  } = useQuery(['japanData', page], () => getArticlesJapan({ page }));

  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (articlesLoading) return;
    const data = articlesData?.data?.data;
    if (!data || !Array.isArray(data)) return;

    if (page === 1) {
      setArticles(data);
      lastAppendedPageRef.current = 1;
      return;
    }
    if (page > lastAppendedPageRef.current) {
      setArticles((prev) => [...prev, ...data]);
      lastAppendedPageRef.current = page;
    }
  }, [articlesData, page, articlesLoading]);

  useEffect(() => {
    if (page !== 1) return;
    lastAppendedPageRef.current = 0;
  }, [page]);

  useEffect(() => {
    if (error) {
      const msg =
        error?.message ||
        (error as any)?.response?.data?.message ||
        'Error al cargar datos';
      toast.error(msg);
    }
  }, [error]);

  useEffect(() => {
    if (errorArticles) {
      const msg =
        errorArticles?.message ||
        (errorArticles as any)?.response?.data?.message ||
        'Error al cargar artículos';
      toast.error(msg);
    }
  }, [errorArticles]);

  useEffect(() => {
    if (errorJapan) {
      const msg =
        (errorJapan as any)?.message ||
        (errorJapan as any)?.response?.data?.message ||
        'Error al cargar artículos de Japón';
      toast.error(msg);
    }
  }, [errorJapan]);

  const loadMore = () => setPage((p) => p + 1);
  const loadArticles = articlesLoading && page > 1;

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
              <Button onClick={loadMore}>
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
