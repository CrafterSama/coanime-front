import { format, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useRandomImageByTitle } from '@/hooks/random-images';
import { useExternalTitle } from '@/hooks/titles';
import SerieItemInfo from '@/components/modules/titles/components/SerieItemInfo';

const Titles = () => {
  const router = useRouter();
  const { data = {}, isLoading } = useExternalTitle({
    type: router?.query?.type,
    title: router?.query?.title,
  });

  const {
    data: randomImage,
    isLoading: isLoadingRandomImage,
  } = useRandomImageByTitle(router?.query?.title);

  const { title: webTitle, description, keywords, data: title } = data;
  console.log('🚀 ~ file: [title].tsx ~ line 25 ~ Titles ~ title', title);

  return (
    <WebLayout>
      {isLoading ||
        (isLoadingRandomImage && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        ))}
      <Head>
        <title>{webTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      {data && !isLoadingRandomImage && (
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
                      randomImage?.image ?? title?.images?.name ?? DEFAULT_IMAGE
                    }
                    alt={title?.name}
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
                        src={title?.images?.name ?? DEFAULT_IMAGE}
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                    <div className="title-info-box">
                      <div className="title-name-box">
                        <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl">
                          {title?.name}
                        </h1>
                      </div>
                      <ul className="title-info-details overlap-banner">
                        <SerieItemInfo
                          title="Tipo"
                          value={
                            <div className="info-details-type">
                              <Link href={`/ecma/titulos/${title?.type?.slug}`}>
                                <a>{title?.type?.name}</a>
                              </Link>
                            </div>
                          }
                        />
                        <SerieItemInfo
                          title="Otros Títulos"
                          value={title?.otherTitles || 'Sin Información'}
                        />
                        <SerieItemInfo
                          title="Primera Emisión"
                          value={
                            <span className="post-date">
                              {title?.broadTime
                                ? format(
                                    new Date(title?.broadTime),
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
                              {title?.broadFinish
                                ? format(
                                    new Date(title?.broadFinish),
                                    'dd LLLL, yyyy',
                                    { locale: es }
                                  )
                                : 'Sin Información'}
                            </span>
                          }
                        />
                        <SerieItemInfo
                          title="Géneros"
                          value={title?.genres?.map((genre) => (
                            <span key={genre?.id} className="genre-tag">
                              <Link href={`/ecma/generos/${genre?.slug}`}>
                                <a>{genre?.name}</a>
                              </Link>
                            </span>
                          ))}
                        />
                        <SerieItemInfo
                          title="Episodios"
                          value={title?.episodes || 'Sin Información'}
                        />
                        <SerieItemInfo
                          title="Clasificación"
                          value={`${title?.rating?.name} (${title?.rating?.description})`}
                        />
                        <SerieItemInfo
                          title="Estatus"
                          value={
                            title?.status === 'En Emisión' &&
                            isBefore(
                              new Date(),
                              new Date(title?.broadFinish)
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
                    dangerouslySetInnerHTML={{ __html: title?.sinopsis }}
                  ></div>
                </div>
              </Section>
            </div>
          </div>
        </>
      )}
    </WebLayout>
  );
};

export default Titles;
