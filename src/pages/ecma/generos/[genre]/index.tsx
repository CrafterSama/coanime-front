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
import { getTitlesByGenre } from '@/services/titles';
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

const Titles = ({ titlesData }) => {
  const router = useRouter();
  const { genre } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TitleData>(titlesData);
  const [kind, setKind] = useState<string>(genre as string);
  const [activeTab, setActiveTab] = useState('genres');

  useEffect(() => {
    setData(titlesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageChange = async () => {
    if (genre) {
      if (kind !== genre) {
        setKind(genre as string);
        setPage(1);
      }
      await router.push({
        pathname: `/ecma/generos/${genre}`,
        query: {
          page,
        },
      });
      const response = await getTitlesByGenre({ genre, page });
      setData(response.data);
      return;
    }
    return;
  };

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, genre]);

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
        <Show condition={!!data as boolean}>
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
            <Show condition={activeTab === 'types'}>
              <CloudLinks allLink="/ecma/titulos" links={data?.types} />
            </Show>
            <Show condition={activeTab === 'genres'}>
              <CloudLinks allLink="/ecma/generos" links={data?.genres} />
            </Show>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[70vh]">
              {data?.result?.data?.map((serie) => (
                <SerieCard key={serie?.id} serie={serie} />
              ))}
              <Show condition={data?.result?.data?.length < 1}>
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

export const getStaticProps = async ({ params }) => {
  const { genre } = params;
  const response = await getTitlesByGenre({
    genre,
    page: Number(params?.page) ?? 1,
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
