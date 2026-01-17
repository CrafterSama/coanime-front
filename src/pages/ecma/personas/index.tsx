import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import PersonCard from '@/components/modules/people/components/PersonCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getPeople } from '@/services/people';
import { Show } from '@/components/ui/Show';
import { withRetry } from '@/utils/getStaticPropsHelper';

type PeopleData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

const People = ({ peopleData }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PeopleData>(peopleData);

  const { result: people = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: '/ecma/personas',
      query: {
        page,
      },
    });
    const response = await getPeople({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

  return (
    <>
      <Head>
        <title>{peopleData?.title}</title>
        <meta name="description" content={peopleData?.description} />
        <meta name="keywords" content={peopleData?.keywords} />
      </Head>
      <WebLayout>
        <Show condition={!people}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={people}>
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {people?.data?.map((person) => (
                <PersonCard key={person?.id} person={person} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={people} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  try {
    const response = await withRetry(() =>
      getPeople({ page: Number(params?.page) ?? 1 })
    );

    if (response?.data?.code === 404) {
      return {
        notFound: true,
      };
    }

    const peopleData = response.data;

    return {
      props: {
        peopleData,
        revalidate: 5 * 60,
      },
    };
  } catch (error) {
    // Si falla después de los reintentos, retornar notFound para permitir regeneración con ISR
    console.error('[getStaticProps] Error al obtener personas:', error);
    return {
      notFound: true,
    };
  }
};

export default People;
