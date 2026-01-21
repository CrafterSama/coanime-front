import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import EventCard from '@/components/modules/events/components/EventCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getEvents } from '@/services/events';
import { Show } from '@/components/ui/Show';
import { withRetry } from '@/utils/getStaticPropsHelper';

type eventsData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

interface EventsProps {
  eventsData: any;
}

const Events = ({ eventsData }: EventsProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<eventsData>(eventsData);

  const { result: events = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: '/eventos',
      query: {
        page,
      },
    });
    const response = await getEvents({ page });
    setData(response.data);
  };

  useEffect(() => {
    onPageChange();
  }, [page]);

  return (
    <>
      <Head>
        <title>{eventsData?.title}</title>
        <meta name="description" content={eventsData?.description} />
        <meta name="keywords" content={eventsData?.keywords} />
      </Head>
      <WebLayout>
        <Show condition={!events}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={events}>
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {events?.data?.map((event: any, index: number) => (
                <EventCard key={event?.id ? event?.id : index} event={event} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={events} />
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
      getEvents({ page: Number(resolvedParams?.page) ?? 1 })
    );

    if (response?.data?.code === 404) {
      return {
        notFound: true,
      };
    }

    const eventsData = response.data;

    return {
      props: {
        eventsData,
        revalidate: 5 * 60,
      },
    };
  } catch (error) {
    // Si falla después de los reintentos, retornar notFound para permitir regeneración con ISR
    console.error('[getStaticProps] Error al obtener eventos:', error);
    return {
      notFound: true,
    };
  }
};

export default Events;
