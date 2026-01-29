import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/layouts/web-layout';
import EntityCard from '@/components/modules/entities/components/entity-card';
import Loading from '@/components/ui/loading';
import Paginator from '@/components/ui/paginator';
import Section from '@/components/ui/section';
import { getEntitiesByCountry } from '@/services/entities';
import { Show } from '@/components/ui/show';

type EntitiesData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

interface CountryProps {
  entitiesData: any;
}

const Country = ({ entitiesData }: CountryProps) => {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<EntitiesData>(entitiesData);

  const { result: entities = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: `/ecma/entidades/pais/${slug}`,
      query: {
        page,
      },
    });
    const response = await getEntitiesByCountry({
      country: slug as string,
      page,
    });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

  return (
    <>
      <Head>
        <title>{entitiesData?.title}</title>
        <meta name="description" content={entitiesData?.description} />
        <meta name="keywords" content={entitiesData?.keywords} />
      </Head>
      <WebLayout>
        <Show when={!entities}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show when={entities}>
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {entities?.data?.map((entity: any) => (
                <EntityCard key={entity?.id} entity={entity} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={entities} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getServerSideProps = async ({ params }: { params?: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const response = await getEntitiesByCountry({
    country: resolvedParams?.slug,
    page: Number(resolvedParams?.page) ?? 1,
  });

  if (response?.data?.code === 404) {
    return {
      notFound: true,
    };
  }

  const entitiesData = response.data;

  return {
    props: {
      entitiesData,
      revalidate: 5 * 60,
    },
  };
};

export default Country;
