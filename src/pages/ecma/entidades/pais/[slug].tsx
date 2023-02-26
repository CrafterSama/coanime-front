import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import EntityCard from '@/components/modules/entities/components/EntityCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getEntitiesByCountry } from '@/services/entities';
import { Show } from '@/components/ui/Show';

type EntitiesData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

const Country = ({ entitiesData }) => {
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
    const response = await getEntitiesByCountry({ country: slug, page });
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
        <Show condition={!entities}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={entities}>
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {entities?.data?.map((entity) => (
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

export const getServerSideProps = async ({ params }) => {
  const response = await getEntitiesByCountry({
    country: params?.slug,
    page: Number(params?.page) ?? 1,
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
