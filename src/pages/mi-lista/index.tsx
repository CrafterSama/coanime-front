import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SerieCard from '@/components/modules/titles/components/SerieCard';
import FlexLayout from '@/components/ui/FlexLayout';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { Show } from '@/components/ui/Show';
import { Tabs } from '@/components/ui/Tabs';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import { useGetUserTitleList } from '@/hooks/titles';
import { getUserTitleList } from '@/services/titles';

const Titles = ({ titlesData }) => {
  const { user } = useAuth({ middleware: 'auth' });
  const router = useRouter();
  const [page, setPage] = useState(titlesData);
  const { data: response } = useGetUserTitleList({ page });
  const [data, setData] = useState(response?.results);
  const [statisticType, setStatisticType] = useState<number | string>('0');
  const [loading, setLoading] = useState(false);

  const onPageChange = async () => {
    await router?.push({
      pathname: '/mi-lista',
      query: {
        page,
      },
    });
    const response = await getUserTitleList({ page });
    setData(response?.data?.results);
    setLoading(false);
  };

  const series: any[] =
    statisticType !== '0'
      ? response?.results?.data.filter(
          (item) => item?.statistics?.id === statisticType
        )
      : response?.results?.data;

  const respStatistics = response?.meta?.statistics;
  const statistics: any[] = respStatistics && [
    { id: '0', name: 'Todas' },
    ...respStatistics,
  ];

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Head>
        <title>{response?.title}</title>
        <meta name="description" content={response?.description} />
        <meta name="keywords" content={response?.keywords} />
      </Head>
      <WebLayout>
        <Show condition={loading}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={data}>
          <Section withContainer>
            <div className="relative flex flex-col gap-4 justify-start px-4 h-72 overflow-hidden rounded-b-xl">
              <Image
                src={user?.profileCoverPath || DEFAULT_IMAGE}
                alt="profile-cover"
                fill
                className="rounded-b-xl object-cover"
              />
              <div className="overlayer"></div>
              <div className="absolute bottom-0 flex flex-col gap-4 justify-start px-4 my-4 lg:my-10">
                <h1 className="text-lg font-bold lg:text-3xl text-white bg-orange-400 px-2 py-1 rounded-md w-[100px] lg:w-[150px] text-center shadow-orange-300">
                  Tu Lista
                </h1>
                <p className="text-sm font-bold lg:text-base text-white">
                  Aca tenemos una lista de todos los títulos que vamos agregando
                  a traves de las watch options, mientras la lista ira creciendo
                  y nuestro sistema podría irte recomendando otras series que te
                  puedan gustar.
                </p>
              </div>
            </div>
            <div className="py-4">
              <FlexLayout gap={2}>
                <FlexLayout direction="row" justify="center">
                  {statistics?.map((item) => (
                    <Tabs
                      key={item?.id}
                      active={statisticType === item?.id}
                      onClick={() => setStatisticType(item?.id)}>
                      {item?.name}
                    </Tabs>
                  ))}
                </FlexLayout>
                <Show condition={series?.length >= 1}>
                  <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[40vh]">
                    {series?.map((serie) => (
                      <div
                        key={serie?.titles?.id}
                        className="relative title-item rounded-lg overflow-hidden">
                        <SerieCard serie={serie?.titles} />
                        <div className="text-center text-sm font-semibold text-gray-700 py-1 px-2 rounded-b-lg bg-orange-100">
                          {serie?.statistics?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Paginator
                    page={page}
                    setPage={setPage}
                    data={response?.results}
                  />
                </Show>
                <Show condition={series?.length === 0}>
                  <div className="text-center py-4">
                    <h3 className="text-xl font-bold text-gray-400">
                      Sin Titulos
                    </h3>
                  </div>
                </Show>
              </FlexLayout>
            </div>
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const page = params?.page || 1;
  return {
    props: {
      titlesData: page,
      revalidate: 5 * 60,
    },
  };
};

export default Titles;
