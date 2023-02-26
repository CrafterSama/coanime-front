import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import EventCard from '@/components/modules/events/components/EventCard';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import { getEventsByCountry } from '@/services/events';
import { Show } from '@/components/ui/Show';

type eventsData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

const Country = ({ eventsData }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<eventsData>(eventsData);

  const { result: events = [] } = data;

  const onPageChange = async () => {
    await router.push({
      pathname: `/eventos/pais/${slug}`,
      query: {
        page,
      },
    });
    const response = await getEventsByCountry({ country: slug, page });
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
              {events?.data?.map((event) => (
                <EventCard key={event?.id} event={event} />
              ))}
            </div>
            <Paginator page={page} setPage={setPage} data={events} />
          </Section>
        </Show>
      </WebLayout>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const response = await getEventsByCountry({
    country: params?.slug,
    page: Number(params?.page) ?? 1,
  });

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

export default Country;
