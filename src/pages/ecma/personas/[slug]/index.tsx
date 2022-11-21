import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';

import WebLayout from '@/components/Layouts/WebLayout';
import ItemInfo from '@/components/ui/ItemInfo';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { getPerson } from '@/services/people';

const Person = ({ personData }) => {
  return (
    <>
      {personData && (
        <Head>
          <title>{personData?.title ?? ''}</title>
          <meta name="description" content={personData?.description ?? ''} />
          <meta name="keywords" content={personData?.keywords ?? ''} />
        </Head>
      )}
      <WebLayout>
        {!personData && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {personData && (
          <>
            <div id="title">
              <Section>
                <div className="title-header">
                  <figure className="title-header-image relative">
                    <Image
                      className={`${
                        personData?.result?.image ? '' : 'blur'
                      } w-full h-full`}
                      src={
                        personData?.result?.image
                          ? `https://api.coanime.net/storage/images/encyclopedia/people/${personData?.result?.image}`
                          : DEFAULT_IMAGE
                      }
                      alt={personData?.result?.name}
                      fill
                    />
                  </figure>
                  <div className="overlayer"></div>
                </div>
              </Section>
              <div className="title-content">
                <Section withContainer>
                  <div className="title-info container px-8 md:p-4">
                    <div className="title-top-box overlap-banner">
                      <figure className="title-image overlap-banner relative rounded">
                        <Image
                          className="w-[300px] h-[380px] object-cover object-center mx-auto"
                          src={
                            personData?.result?.image
                              ? `https://api.coanime.net/storage/images/encyclopedia/people/${personData?.result?.image}`
                              : DEFAULT_IMAGE
                          }
                          fill
                          alt={personData?.result?.name}
                        />
                      </figure>
                      <div className="title-info-box">
                        <div className="title-name-box">
                          <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl">
                            {personData?.result?.name} (
                            {personData?.result?.japaneseName})
                          </h1>
                        </div>
                        <ul className="title-info-details overlap-banner">
                          <ItemInfo
                            title="Nombre de Nacimiento"
                            value={
                              personData?.result?.japaneseName ||
                              'Sin Información'
                            }
                          />
                          <ItemInfo
                            title="Ciudad de Origen"
                            value={
                              `${personData?.result?.city?.name}, ${personData?.result?.country?.name}` ||
                              'Sin Información'
                            }
                          />
                          <ItemInfo
                            title="Fecha de Nacimiento"
                            value={
                              <span className="post-date">
                                {personData?.result?.birthday
                                  ? format(
                                      new Date(personData?.result?.birthday),
                                      'dd LLLL, yyyy',
                                      { locale: es }
                                    )
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <ItemInfo
                            title="País de Origen"
                            value={
                              personData?.result?.country?.name
                                ? `${personData?.result?.country?.emoji} ${personData?.result?.country?.name}`
                                : 'Sin Información'
                            }
                          />
                        </ul>
                      </div>
                    </div>
                    <div
                      className="title-sinopsis"
                      dangerouslySetInnerHTML={{
                        __html: personData?.result?.about,
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
  const response = await getPerson({
    slug,
  });

  const personData = response.data;

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
      personData,
      revalidate: 5 * 60,
    },
  };
}

export default Person;
