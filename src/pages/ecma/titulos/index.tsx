import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SeriesList from '@/components/modules/titles/components/SeriesList';
import CloudLinks from '@/components/ui/CloudLinks';
import FlexLayout from '@/components/ui/FlexLayout';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { getTitles } from '@/services/titles';
import { Show } from '@/components/ui/Show';
import { withRetry } from '@/utils/getStaticPropsHelper';

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
  const [activeTab, setActiveTab] = useState('types');

  const { result: series = [], types, genres } = data;

  useEffect(() => {
    if (router?.query?.page) {
      setPage(router?.query?.page);
    }
  }, [router?.query?.page]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const tabs = [
    {
      key: 'types',
      title: 'Tipos',
      component: <CloudLinks allLink="/ecma/titulos" links={types} />,
    },
    {
      key: 'genres',
      title: 'Géneros',
      component: <CloudLinks allLink="/ecma/generos" links={genres} />,
    },
  ];

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
            <FlexLayout justify="center" align="center" gap={1}>
              <FlexLayout direction="row" justify="center">
                {tabs.map((item) => (
                  <Tabs
                    key={item.key}
                    active={activeTab === item.key}
                    onClick={() => setActiveTab(item.key)}>
                    {item.title}
                  </Tabs>
                ))}
              </FlexLayout>
              {tabs.map((item) => (
                <TabsContent key={item.key} active={activeTab === item.key}>
                  {item.component}
                </TabsContent>
              ))}
            </FlexLayout>
            <SeriesList series={series?.data} />
            <Paginator page={page} setPage={setPage} data={series} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  try {
    const response = await withRetry(() =>
      getTitles({ page: Number(resolvedParams?.page) ?? 1 })
    );

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
  } catch (error) {
    // Si falla después de los reintentos, retornar notFound para permitir regeneración con ISR
    console.error('[getStaticProps] Error al obtener títulos:', error);
    return {
      notFound: true,
    };
  }
};

export default Titles;
