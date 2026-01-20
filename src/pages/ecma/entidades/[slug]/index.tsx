import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';
import ImageDetails from '@/components/ui/ImageDetails';
import ItemInfo from '@/components/ui/ItemInfo';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { getEntity } from '@/services/entities';
import { Show } from '@/components/ui/Show';

const Entity = ({ entityData }) => {
  return (
    <>
      {entityData && (
        <Head>
          <title>{entityData?.title ?? ''}</title>
          <meta name="description" content={entityData?.description ?? ''} />
          <meta name="keywords" content={entityData?.keywords ?? ''} />
        </Head>
      )}
      <WebLayout>
        <Show condition={!entityData}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        </Show>
        <Show condition={entityData}>
          <div id="title">
            <Section>
              <div className="title-header">
                <figure className="title-header-image relative">
                  <Image
                    className={`${
                      entityData?.result?.image ? '' : 'blur'
                    } w-full h-full`}
                    src={
                      entityData?.result?.image
                        ? `https://api.coanime.net/storage/images/encyclopedia/people/${entityData?.result?.image}`
                        : DEFAULT_IMAGE
                    }
                    alt={entityData?.result?.name}
                    fill
                    unoptimized
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
                        entityData?.result?.image
                          ? `https://api.coanime.net/storage/images/encyclopedia/people/${entityData?.result?.image}`
                          : DEFAULT_IMAGE
                      }
                    />
                    <div className="title-info-box">
                      <div className="title-name-box">
                        <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl text-center">
                          {entityData?.result?.name}
                        </h1>
                      </div>
                      <ul className="title-info-details overlap-banner">
                        <ItemInfo
                          title="Fundada el"
                          value={
                            <span className="post-date">
                              <Show
                                condition={entityData?.result?.foundationDate}>
                                {typeof entityData?.result?.foundationDate ===
                                  'string' &&
                                  format(
                                    new Date(
                                      entityData?.result?.foundationDate
                                    ),
                                    'dd LLLL, yyyy',
                                    { locale: es }
                                  )}
                              </Show>
                              <Show
                                condition={!entityData?.result?.foundationDate}>
                                'Sin Información'
                              </Show>
                            </span>
                          }
                        />
                        <ItemInfo
                          title="País de Origen"
                          value={
                            entityData?.result?.country?.name
                              ? `${entityData?.result?.country?.emoji} ${entityData?.result?.country?.name}`
                              : 'Sin Información'
                          }
                        />
                        <ItemInfo
                          title="Website"
                          value={
                            entityData?.result?.website ? (
                              <Link
                                href={entityData?.result?.website}
                                target="_blank">
                                Ir al Website
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
                      __html: entityData?.result?.about,
                    }}></div>
                </div>
              </Section>
            </div>
          </div>
        </Show>
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
  // Next.js 15: params puede ser una Promise
  const params = await context.params;
  const { slug } = params;
  const response = await getEntity({
    slug,
  });

  const entityData = response.data;

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
      entityData,
      revalidate: 5 * 60,
    },
  };
}

export default Entity;
