import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';
import ItemInfo from '@/components/ui/ItemInfo';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { getMagazine } from '@/services/magazine';
import { strToSlug } from '@/utils/string';

const Magazine = ({ magazineData }) => {
  return (
    <>
      {magazineData && (
        <Head>
          <title>{magazineData?.title ?? ''}</title>
          <meta name="description" content={magazineData?.description ?? ''} />
          <meta name="keywords" content={magazineData?.keywords ?? ''} />
        </Head>
      )}
      <WebLayout>
        {!magazineData && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {magazineData && (
          <>
            <div id="title">
              <Section>
                <div className="title-header">
                  <figure className="title-header-image relative">
                    <Image
                      className={`${
                        magazineData?.result?.images?.name ? '' : 'blur'
                      } w-full h-full`}
                      src={
                        magazineData?.result?.image?.name
                          ? `https://api.coanime.net/storage/images/encyclopedia/magazine/${magazineData?.result?.image?.name}`
                          : DEFAULT_IMAGE
                      }
                      alt={magazineData?.result?.name}
                      layout="fill"
                      objectFit="cover"
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
                      <figure className="title-image overlap-banner relative rounded">
                        <Image
                          className="w-[300px] h-[380px] object-cover object-center mx-auto"
                          src={
                            magazineData?.result?.image?.name
                              ? `https://api.coanime.net/storage/images/encyclopedia/magazine/${magazineData?.result?.image?.name}`
                              : DEFAULT_IMAGE
                          }
                          layout="fill"
                          objectFit="cover"
                        />
                      </figure>
                      <div className="title-info-box">
                        <div className="title-name-box">
                          <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl text-center">
                            {magazineData?.result?.name}
                          </h1>
                        </div>
                        <ul className="title-info-details overlap-banner">
                          <ItemInfo
                            title="Tipo"
                            value={
                              <div className="info-details-type">
                                <Link
                                  href={`/ecma/revistas/${strToSlug(
                                    magazineData?.result?.type?.name
                                  )}`}
                                >
                                  <a>{magazineData?.result?.type?.name}</a>
                                </Link>
                              </div>
                            }
                          />
                          <ItemInfo
                            title="Frecuencia de Salida"
                            value={
                              magazineData?.result?.release?.name ||
                              'Sin Información'
                            }
                          />
                          <ItemInfo
                            title="Fecha de Fundación"
                            value={
                              <span className="post-date">
                                {magazineData?.result?.foundationDate
                                  ? format(
                                      new Date(
                                        magazineData?.result?.foundationDate
                                      ),
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
                              magazineData?.result?.country?.name
                                ? `${magazineData?.result?.country?.emoji} ${magazineData?.result?.country?.name}`
                                : 'Sin Información'
                            }
                          />
                          <ItemInfo
                            title="Website"
                            value={
                              magazineData?.result?.website ? (
                                <Link href={magazineData?.result?.website}>
                                  <a target="_blank">Website</a>
                                </Link>
                              ) : (
                                'Sin Información'
                              )
                            }
                          />
                        </ul>
                      </div>
                    </div>
                    <div
                      className="title-sinopsis"
                      dangerouslySetInnerHTML={{
                        __html: magazineData?.result?.about,
                      }}
                    ></div>
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
  const response = await getMagazine({
    slug,
  });

  const magazineData = response.data;

  if (response.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
        // statusCode: 301
      },
    };
  }

  if (response.status === 500) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
        // statusCode: 301
      },
    };
  }

  return {
    props: {
      slug,
      magazineData,
      revalidate: 5 * 60,
    },
  };
}

export default Magazine;
