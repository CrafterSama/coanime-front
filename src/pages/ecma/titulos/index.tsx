import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SerieCard from '@/components/modules/titles/components/SerieCard';
import CloudLinks from '@/components/ui/CloudLinks';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getTitles } from '@/services/titles';

type TitleData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
  genres: any;
  types: any;
};

const Titles = ({ titlesData }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TitleData>(titlesData);

  const {
    title,
    description,
    keywords,
    result: series = [],
    genres,
    types,
  } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: '/ecma/titulos/',
      query: {
        page,
      },
    });
    const response = await getTitles({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

  return (
    <>
      <Head>
        <title>{title ?? ''}</title>
        <meta name="description" content={description ?? ''} />
        <meta name="keywords" content={keywords ?? ''} />
      </Head>
      <WebLayout>
        {!data && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {series && (
          <Section withContainer>
            <CloudLinks allLink="/ecma/titulos" links={types} />
            <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[90vh]">
              {series?.data?.map((serie) => (
                <SerieCard key={serie?.id} serie={serie} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={series} />
          </Section>
        )}
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const response = await getTitles({ page: Number(params?.page) ?? 1 });

  if (response?.data?.code === 404) {
    return {
      notFound: true,
    };
  }

  const titlesData = response.data;

  return {
    props: {
      titlesData,
      revalidate: 5 * 60,
    },
  };
};

export default Titles;
