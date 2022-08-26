import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { format, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import SerieItemInfo from '@/components/modules/titles/components/SerieItemInfo';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useRandomImageByTitle } from '@/hooks/random-images';
import { getRandomImageByTitle, getTitle } from '@/services/titles';

const Titles = ({ titleData, randomImage, errors }) => {
  const router = useRouter();

  useEffect(() => {
    if (errors) {
      toast.error(errors);
      router.push('/404');
    }
  }, [errors]);

  return (
    <>
      {titleData && (
        <Head>
          <title>{titleData?.title ?? ''}</title>
          <meta name="description" content={titleData?.description ?? ''} />
          <meta name="keywords" content={titleData?.keywords ?? ''} />
        </Head>
      )}
      <WebLayout>
        {!titleData && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {titleData && (
          <>
            <div id="title">
              <Section>
                <div className="title-header">
                  <figure className="title-header-image relative">
                    <Image
                      className={`${
                        randomImage?.image ? '' : 'blur'
                      } w-full h-full`}
                      src={
                        randomImage?.image
                          ? randomImage?.image
                          : titleData?.result?.images?.name
                          ? titleData?.result?.images?.name
                          : DEFAULT_IMAGE
                      }
                      alt={titleData?.result?.name}
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
                  <div className="title-info container">
                    <div className="title-top-box overlap-banner">
                      <figure className="title-image overlap-banner relative rounded">
                        <Image
                          className="w-[300px] h-[380px] object-cover object-center mx-auto"
                          src={titleData?.result?.images?.name ?? DEFAULT_IMAGE}
                          layout="fill"
                          objectFit="cover"
                        />
                      </figure>
                      <div className="title-info-box">
                        <div className="title-name-box">
                          <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl">
                            {titleData?.result?.name}
                          </h1>
                        </div>
                        <ul className="title-info-details overlap-banner">
                          <SerieItemInfo
                            title="Tipo"
                            value={
                              <div className="info-details-type">
                                <Link
                                  href={`/ecma/titulos/${titleData?.result?.type?.slug}`}
                                >
                                  <a>{titleData?.result?.type?.name}</a>
                                </Link>
                              </div>
                            }
                          />
                          <SerieItemInfo
                            title="Otros Títulos"
                            value={
                              titleData?.result?.otherTitles ||
                              'Sin Información'
                            }
                          />
                          <SerieItemInfo
                            title="Primera Emisión"
                            value={
                              <span className="post-date">
                                {titleData?.result?.broadTime
                                  ? format(
                                      new Date(titleData?.result?.broadTime),
                                      'dd LLLL, yyyy',
                                      { locale: es }
                                    )
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <SerieItemInfo
                            title="Ultima Emisión"
                            value={
                              <span className="post-date">
                                {titleData?.result?.broadFinish
                                  ? format(
                                      new Date(titleData?.result?.broadFinish),
                                      'dd LLLL, yyyy',
                                      { locale: es }
                                    )
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <SerieItemInfo
                            title="Géneros"
                            value={titleData?.result?.genres?.map((genre) => (
                              <span key={genre?.id} className="genre-tag">
                                <Link href={`/ecma/generos/${genre?.slug}`}>
                                  <a>{genre?.name}</a>
                                </Link>
                              </span>
                            ))}
                          />
                          <SerieItemInfo
                            title="Episodios"
                            value={
                              titleData?.result?.episodes || 'Sin Información'
                            }
                          />
                          <SerieItemInfo
                            title="Clasificación"
                            value={`${titleData?.result?.rating?.name} (${titleData?.result?.rating?.description})`}
                          />
                          <SerieItemInfo
                            title="Estatus"
                            value={
                              titleData?.result?.status === 'En Emisión' &&
                              isBefore(
                                new Date(),
                                new Date(titleData?.result?.broadFinish)
                              ) ? (
                                <div className="border-2 border-teal-500 text-teal-500 rounded-md px-1">
                                  En Emisión
                                </div>
                              ) : (
                                <div className="rounded-md border-2 border-red-400 text-red-400 px-1">
                                  Finalizado
                                </div>
                              )
                            }
                          />
                        </ul>
                      </div>
                    </div>
                    <div
                      className="title-sinopsis"
                      dangerouslySetInnerHTML={{
                        __html: titleData?.result?.sinopsis,
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

export async function getStaticProps({ params }) {
  let res = null;
  let errors = null;
  let titleData = null;
  let randomImage = null;
  const { type, title } = params;
  try {
    res = await getTitle({ type, title });
    titleData = res.data;
  } catch (error) {
    errors = error.response.data.message.text;
  }

  try {
    randomImage = await getRandomImageByTitle({ title });
  } catch (error) {
    randomImage = error.response.data.message.text;
  }

  if (res?.status === 404 || res?.status === 500) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      type,
      title,
      titleData,
      randomImage,
      errors,
      revalidate: 5 * 60,
    },
  };
}

export default Titles;
