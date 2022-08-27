import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useQuery } from 'react-query';

import Head from 'next/head';

import WebLayout from '@/components/Layouts/WebLayout';
import BroadcastToday from '@/components/modules/home/components/BroadcastToday';
import OtherNews from '@/components/modules/home/components/OtherNews';
import RecentPosts from '@/components/modules/home/components/RecentPosts';
import TopSlider from '@/components/modules/home/components/TopSlider';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getHomeData } from '@/services/home';
import { getArticlesData } from '@/services/posts';

const Home = ({ homeData, articlesData }) => {
  const [articles, setArticles] = useState([]);
  const [loadArticles, setLoadArticles] = useState(false);
  const [page, setPage] = useState(1);
  const { data = {}, isLoading } = useQuery(['home'], getHomeData, {
    initialData: homeData,
  });
  const { title = '', description = '', keywords = '', relevants = [] } = data;

  useEffect(() => {
    if (articlesData) {
      setArticles([...articles, ...articlesData?.data]);
    }
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
  }, [page]);

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
        <meta name="author" content="@coanime" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
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
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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
  const response = await getHomeData();
  const articles = await getArticlesData({ page });

  const homeData = response.data;
  const articlesData = articles.data;

  return { props: { homeData, articlesData } };
}

export default Home;
