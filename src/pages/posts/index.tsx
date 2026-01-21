import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import OtherNews from '@/components/modules/home/components/OtherNews';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getArticlesData } from '@/services/posts';

type ArticlesProps = {
  title: string;
  description: string;
  keywords: string;
  data: any;
};

const Posts = ({ articlesData }: { articlesData: ArticlesProps }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ArticlesProps>(articlesData);

  const { data: articles = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: '/posts',
      query: {
        page,
      },
    });
    const response = await getArticlesData({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <WebLayout>
      <Head>
        <title>Coanime.net - Articles Dashboard</title>
      </Head>

      <div className="py-12">
        <Section withContainer>
          <SectionTitle title="Hot News" subtitle={`Pagina ${page}`} />
          <OtherNews articles={articles} />
          <div className="flex justify-center">
            <Button onClick={() => setPage(page + 1)}>
              {!articles ? (
                <CgSpinner className="animate-spin" />
              ) : (
                'Mas Articulos'
              )}
            </Button>
          </div>
        </Section>
      </div>
    </WebLayout>
  );
};

export const getServerSideProps = async ({ params }: { params?: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const response = await getArticlesData({
    page: Number(resolvedParams?.page) ?? 1,
  });

  if (response.data.code === 404) {
    return {
      notFound: true,
    };
  }

  const articlesData = response.data;

  return {
    props: {
      articlesData,
      revalidate: 5 * 60,
    },
  };
};

export default Posts;
