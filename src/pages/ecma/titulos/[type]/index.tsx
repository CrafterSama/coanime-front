import { useEffect, useState } from 'react';

import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SerieCard from '@/components/modules/titles/components/SerieCard';
import CloudLinks from '@/components/ui/CloudLinks';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getTitlesByType } from '@/services/titles';
import { Show } from '@/components/ui/Show';

type TitleData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
  types: any;
  genres: any;
};

const tabs = [
  { key: 'types', title: 'Tipos' },
  { key: 'genres', title: 'Géneros' },
];

const Titles = ({ titlesData }: { titlesData: TitleData }) => {
  const router = useRouter();
  const { type } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TitleData>(titlesData);
  const [kind, setKind] = useState<string>(type as string);
  const [activeTab, setActiveTab] = useState('types');

  useEffect(() => {
    setData(titlesData);
  }, []);

  const onPageChange = async () => {
    if (type) {
      if (kind !== type) {
        setKind(type as string);
        setPage(1);
      }
      await router.push({
        pathname: `/ecma/titulos/${type}`,
        query: {
          page,
        },
      });
      const response = await getTitlesByType({ type: type as string, page });
      setData(response.data);
      return;
    }
    return;
  };

  useEffect(() => {
    onPageChange();
  }, [page, type]);

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
        <Show when={!!data}>
          <Section withContainer>
            <div className="flex flex-row gap-4 justify-center">
              {tabs.map((item) => {
                return (
                  <div
                    key={item.key}
                    className={cn(
                      'inline-block p-1 font-bold	cursor-pointer border-b-2 ',
                      {
                        'text-gray-400 border-transparent':
                          item.key !== activeTab,
                        'text-gray-700 border-orange-500':
                          item.key === activeTab,
                      }
                    )}
                    onClick={() => setActiveTab(item.key)}>
                    {item.title}
                  </div>
                );
              })}
            </div>
            <Show when={activeTab === 'types'}>
              <CloudLinks allLink="/ecma/titulos" links={data?.types} />
            </Show>
            <Show when={activeTab === 'genres'}>
              <CloudLinks allLink="/ecma/generos" links={data?.genres} />
            </Show>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[70vh]">
              <Show when={data?.result?.data?.length >= 1}>
                {data?.result?.data?.map((serie: any) => (
                  <SerieCard key={serie?.id} serie={serie} />
                ))}
              </Show>
              <Show when={data?.result?.data?.length < 1}>
                <div className="text-center text-gray-600">
                  No hay Series para mostrar en este apartado.
                </div>
              </Show>
            </div>
            <Paginator page={page} setPage={setPage} data={data?.result} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async ({ params }: { params?: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const { type } = resolvedParams;
  const response = await getTitlesByType({
    type,
    page: Number(resolvedParams?.page) ?? 1,
  });

  if (response?.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
        // statusCode: 301
      },
    };
  }

  if (response?.status === 500) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
        // statusCode: 301
      },
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
