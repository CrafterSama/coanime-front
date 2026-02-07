import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/layouts/web-layout';
import SeriesList from '@/components/modules/titles/components/series-list';
import Loading from '@/components/ui/loading';
import Paginator from '@/components/ui/paginator';
import Section from '@/components/ui/section';
import { getUpcomingTitles } from '@/services/titles';
import { Show } from '@/components/ui/show';
import { withRetry } from '@/utils/get-static-props-helper';

type TitleData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
  genres: any;
  types: any;
};

interface TitlesProps {
  titlesData: any;
}

const Titles = ({ titlesData }: TitlesProps) => {
  const router = useRouter();
  const [page, setPage] = useState<any>(1);
  const [data, setData] = useState<TitleData>(titlesData);
  // const [activeTab, setActiveTab] = useState('types');

  const { result: series = [] /*, types, genres*/ } = data;

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
        <Show when={!data}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show when={series}>
          <Section withContainer>
            <SeriesList series={series?.data} />
            <Paginator page={page} setPage={setPage} data={series} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }: { params?: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  try {
    const response = await withRetry(() =>
      getUpcomingTitles({ page: Number(resolvedParams?.page) ?? 1 })
    );

    // El backend devuelve 404 cuando no hay estrenos, pero incluye title, description, result: [].
    // No usar notFound: true aquí: "sin estrenos" es un estado válido, la página debe mostrarse.
    const titlesData =
      response?.data?.code === 404
        ? {
            ...response.data,
            result: { data: [], current_page: 1, last_page: 1, total: 0 },
          }
        : response.data;

    return {
      props: {
        titlesData,
        revalidate: 5 * 60,
      },
    };
  } catch (error: any) {
    // 404 = backend devuelve "no hay estrenos"; otros = fallo de red/servidor.
    // En todos los casos devolvemos props para que la ruta exista (no notFound).
    const errData = error?.response?.data;
    const is404 = error?.response?.status === 404;
    return {
      props: {
        titlesData: {
          title:
            errData?.title ??
            'Coanime.net - Titulos - Próximos Estrenos',
          description: errData?.descripcion ?? errData?.description ?? '',
          keywords: errData?.keywords ?? '',
          result: {
            data: [],
            current_page: 1,
            last_page: 1,
            total: 0,
          },
        },
        revalidate: is404 ? 5 * 60 : 60,
      },
    };
  }
};

export default Titles;
