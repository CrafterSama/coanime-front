import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SeriesList from '@/components/modules/titles/components/SeriesList';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getUpcomingTitles } from '@/services/titles';
import { Show } from '@/components/ui/Show';

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
  const [page, setPage] = useState<any>(1);
  const [data, setData] = useState<TitleData>(titlesData);
  // const [activeTab, setActiveTab] = useState('types');

  const { result: series = [], types, genres } = data;

  useEffect(() => {
    if (router?.query?.page) {
      setPage(router?.query?.page);
    }
  }, [router?.query?.page]);

  const onPageChange = async () => {
    await router.push({
      pathname: '/ecma/titulos/estrenos',
      query: {
        page,
      },
    });
    const response = await getUpcomingTitles({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Head>
        <title>{titlesData?.title}</title>
        <meta name="description" content={titlesData?.description} />
        <meta name="keywords" content={titlesData?.keywords} />
      </Head>
      <WebLayout>
        <Show condition={!data}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={series}>
          <Section withContainer>
            <SeriesList series={series?.data} />
            <Paginator page={page} setPage={setPage} data={series} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const response = await getUpcomingTitles({ page: Number(params?.page) ?? 1 });

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
