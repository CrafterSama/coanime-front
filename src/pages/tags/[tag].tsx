import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import Head from 'next/head';
import { GetStaticProps } from 'next/types';

import WebLayout from '@/components/layouts/web-layout';
import BroadcastToday from '@/components/modules/home/components/broadcast-today';
import OtherNews from '@/components/modules/home/components/other-news';
import RecentPosts from '@/components/modules/home/components/recent-posts';
import TopSlider from '@/components/modules/home/components/top-slider';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { useTags } from '@/hooks/tags';
import { getArticlesByTags, getTags } from '@/services/tags';

interface TagsProps {
  tag: string;
  tagData: any;
  articlesData: any;
  errors: any;
}

const Tags = ({ tag, tagData, articlesData, errors }: TagsProps) => {
  const { data = {}, isLoading } = useTags(tag, tagData);

  const [articles, setArticles] = useState<any[]>([]);
  const [loadArticles, setLoadArticles] = useState(false);
  const [page, setPage] = useState(1);
  const {
    title = '',
    description = '',
    keywords = '',
    relevants = [],
    broadcast = [],
  } = (data as any) || {};

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

export const getStaticProps: GetStaticProps = async ({
  params,
}: {
  params?: any;
}) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const tag = resolvedParams?.tag as string | undefined;
  if (!tag) {
    return { notFound: true };
  }
  let response = null;
  let articles = null;
  let errors = null;
  try {
    response = await getTags(tag);
    articles = await getArticlesByTags({ tag, page: 1 });
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
      tag: resolvedParams?.tag,
      tagData: response?.data,
      articlesData: articles?.data,
      errors,
      revalidate: 5 * 60,
    },
  };
};

export default Tags;
