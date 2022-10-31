import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';

import WebLayout from '@/components/Layouts/WebLayout';
import ImageDetails from '@/components/ui/ImageDetails';
import ItemInfo from '@/components/ui/ItemInfo';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { getEvent } from '@/services/events';

const Event = ({ eventData }) => {
  return (
    <>
      {eventData && (
        <Head>
          <title>{eventData?.title ?? ''}</title>
          <meta name="description" content={eventData?.description ?? ''} />
          <meta name="keywords" content={eventData?.keywords ?? ''} />
        </Head>
      )}
      <WebLayout>
        {!eventData && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {eventData && (
          <>
            <div id="title">
              <Section>
                <div className="title-header">
                  <figure className="title-header-image relative">
                    <Image
                      className={`${
                        eventData?.result?.image ? '' : 'blur'
                      } w-full h-full`}
                      src={
                        eventData?.result?.image
                          ? `https://api.coanime.net/storage/images/events/${eventData?.result?.image}`
                          : DEFAULT_IMAGE
                      }
                      alt={eventData?.result?.name}
                      fill
                      objectPosition="center"
                    />
                  </figure>
                  <div className="overlayer"></div>
                </div>
              </Section>
              <div className="title-content">
                <Section withContainer>
                  <div className="title-info container px-8 md:p-4">
                    <div className="title-top-box overlap-banner">
                      <ImageDetails
                        src={
                          eventData?.result?.image
                            ? `https://api.coanime.net/storage/images/events/${eventData?.result?.image}`
                            : DEFAULT_IMAGE
                        }
                      />
                      <div className="title-info-box">
                        <div className="title-name-box">
                          <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl">
                            {eventData?.result?.name}
                          </h1>
                        </div>
                        <ul className="title-info-details overlap-banner">
                          <ItemInfo
                            title="Empieza el"
                            value={
                              <span className="post-date">
                                {eventData?.result?.dateStart
                                  ? format(
                                      new Date(eventData?.result?.dateStart),
                                      'dd LLLL, yyyy hh:mm a',
                                      { locale: es }
                                    )
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <ItemInfo
                            title="Culmina el"
                            value={
                              <span className="post-date">
                                {eventData?.result?.dateEnd
                                  ? format(
                                      new Date(eventData?.result?.dateEnd),
                                      'dd LLLL, yyyy hh:mm a',
                                      { locale: es }
                                    )
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <ItemInfo
                            title="País de Origen"
                            value={
                              eventData?.result?.country?.name
                                ? `${eventData?.result?.country?.emoji} ${eventData?.result?.country?.name}`
                                : 'Sin Información'
                            }
                          />
                          <ItemInfo
                            title="Website"
                            value={
                              eventData?.result?.website || 'Sin Información'
                            }
                          />
                        </ul>
                      </div>
                    </div>
                    <div
                      className="title-sinopsis"
                      dangerouslySetInnerHTML={{
                        __html: eventData?.result?.description,
                      }}></div>
                  </div>
                </Section>
              </div>
            </div>
          </>
        )}
      </WebLayout>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const params = context.params;
  const { slug } = params;
  const response = await getEvent({
    slug,
  });

  const eventData = response.data;

  if (response.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  if (response.status === 500) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  return {
    props: {
      slug,
      eventData,
      revalidate: 5 * 60,
    },
  };
}

export default Event;
