import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import Head from 'next/head';
import { GetStaticProps } from 'next/types';

import WebLayout from '@/components/Layouts/WebLayout';
import BroadcastToday from '@/components/modules/home/components/BroadcastToday';
import OtherNews from '@/components/modules/home/components/OtherNews';
import RecentPosts from '@/components/modules/home/components/RecentPosts';
import TopSlider from '@/components/modules/home/components/TopSlider';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getArticlesByTags, getTags } from '@/services/tags';
import { useQuery } from '@tanstack/react-query';

const Tags = ({ tag, tagData, articlesData, errors }) => {
  const { data = {}, isLoading } = useQuery(['tags', tagData], getTags, {
    initialData: tagData,
  });
  const [articles, setArticles] = useState([]);
  const [loadArticles, setLoadArticles] = useState(false);
  const [page, setPage] = useState(1);
  const {
    title = '',
    description = '',
    keywords = '',
    relevants = [],
    broadcast = [],
  } = data;

  useEffect(() => {
    if (articlesData) {
      setArticles([...articles, ...articlesData.data]);
    }
    if (errors) {
      toast.error(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moreArticles = async () => {
    setLoadArticles(true);
    const response = await getArticlesByTags({ tag, page });
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
        <BroadcastToday broadcast={broadcast} />
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

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let response = null;
  let articles = null;
  let errors = null;
  try {
    response = await getTags(params?.tag);
    articles = await getArticlesByTags({ tag: params?.tag, page: 1 });
  } catch (error) {
    errors = error.response.data.message.text;
  }

  if (response?.data?.code === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tag: params?.tag,
      tagData: response?.data,
      articlesData: articles?.data,
      errors,
      revalidate: 5 * 60,
    },
  };
};

export default Tags;
