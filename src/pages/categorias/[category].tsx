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
import { getArticlesByCategories, getCategory } from '@/services/categories';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@/interface/articles';

interface CategoriesProps {
  category: string;
  data: any;
  articles: any;
  errors: any;
}

const Categories = ({ category, data, articles, errors }: CategoriesProps) => {
  const { data: categories = {}, isLoading } = useQuery(
    ['categories', category],
    () => getCategory(category),
    { initialData: data, enabled: !!data }
  );
  const [news, setNews] = useState<Article[]>([]);
  const [loadArticles, setLoadArticles] = useState(false);
  const [page, setPage] = useState(1);
  const {
    title = '',
    description = '',
    keywords = '',
    relevants = [],
    broadcast = [],
  } = (categories as any) || {};

  useEffect(() => {
    if (articles) {
      setNews(
        articles.data?.[0]?.categoryId === news?.[0]?.categoryId
          ? [...news, ...articles.data]
          : articles.data
      );
    }
    if (errors) {
      toast.error(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const moreArticles = async () => {
    setLoadArticles(true);
    const response = await getArticlesByCategories({ page, category });
    const oldArticles: any[] = news;
    const newArticles: any[] = response?.data?.data;
    setNews([...oldArticles, ...newArticles]);
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
        <OtherNews articles={news} />
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

export const getStaticProps: GetStaticProps = async (context) => {
  // Next.js 15: params puede ser una Promise
  const params = await context.params;
  const category = params?.category as string | undefined;
  let response = null;
  let articles = null;
  let errors = null;
  try {
    if (!category) {
      return {
        notFound: true,
      };
    }
    response = await getCategory(String(category) as string);
    articles = await getArticlesByCategories({
      category: String(category),
      page: 1,
    });
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
      category,
      data: response?.data,
      articles: articles?.data,
      errors,
      revalidate: 5 * 60,
    },
  };
};

export default Categories;
