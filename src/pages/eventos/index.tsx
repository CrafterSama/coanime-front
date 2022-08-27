import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import EntityCard from '@/components/modules/entities/components/EntityCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getEvents } from '@/services/events';
import EventCard from '@/components/modules/events/components/EventCard';

type eventsData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

const Events = ({ eventsData }) => {
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
        {!events && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {events && (
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {events?.data?.map((event) => (
                <EventCard key={event?.id} event={event} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={events} />
          </Section>
        )}
      </WebLayout>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const response = await getEvents({ page: Number(params?.page) ?? 1 });

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
};

export default Events;
