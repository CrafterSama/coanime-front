import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import WebLayout from '@/components/layouts/web-layout';
import EventCard from '@/components/modules/events/components/event-card';
import Loading from '@/components/ui/loading';
import Paginator from '@/components/ui/paginator';
import Section from '@/components/ui/section';
import { getEventsByCountry } from '@/services/events';
import { Show } from '@/components/ui/show';

type eventsData = {
  title: string;
  description: string;
  keywords: string;
  result: any;
};

interface CountryProps {
  eventsData: any;
}

const Country = ({ eventsData }: CountryProps) => {
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
    const response = await getEventsByCountry({
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
        <title>{eventsData?.title}</title>
        <meta name="description" content={eventsData?.description} />
        <meta name="keywords" content={eventsData?.keywords} />
      </Head>
      <WebLayout>
        <Show when={!events}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show when={events}>
          <Section withContainer>
            <div className="flex flex-wrap gap-2 justify-center px-4 py-8 min-h-[90vh]">
              {events?.data?.map((event: any) => (
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

export const getServerSideProps = async ({ params }: { params?: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const response = await getEventsByCountry({
    country: resolvedParams?.slug,
    page: Number(resolvedParams?.page) ?? 1,
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
