import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import { Permissions } from '@/components/modules/common/Permissions';
import OtherArticles from '@/components/modules/posts/components/OtherArticles';
import Rates from '@/components/modules/titles/components/Rates';
import SerieItemInfo from '@/components/modules/titles/components/SerieItemInfo';
import Statistics from '@/components/modules/titles/components/Statistics';
import FlexLayout from '@/components/ui/FlexLayout';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import { useRandomImageByTitle } from '@/hooks/random-images';
import { useCheckUserStatistics, useCheckUserRates } from '@/hooks/users';
import { getTitle } from '@/services/titles';
import { PencilIcon, PlusSmIcon } from '@heroicons/react/outline';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

dayjs.extend(utc);

const STATUS_COLORS = {
  emision: 'border-teal-400 text-teal-400',
  finalizado: 'border-red-400 text-red-400',
  estreno: 'border-blue-400 text-blue-400',
};

const status = {
  'En emisión': 'emision',
  Finalizado: 'finalizado',
  Estreno: 'estreno',
};

const Titles = ({ title, titleData, errors }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useAuth({ middleware: 'auth' });
  const [censored, setCensored] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (titleData?.result?.ratingId === 6) {
      setCensored(true);
    }
  }, []);

  useEffect(() => {
    if (errors || titleData?.code === 404) {
      titleData?.code === 400
        ? toast.error(titleData.message.text)
        : toast.error(errors);
      router.push('/404');
    }
  }, [errors]);

  const {
    data: userStatistics,
    refetch: refetchStatistics,
  } = useCheckUserStatistics({
    user: user?.id,
    title: titleData?.result?.id,
  });

  const { data: userRates, refetch: refetchRates } = useCheckUserRates({
    user: user?.id,
    title: titleData?.result?.id,
  });

  const {
    data: randomImage = {},
    isLoading: imageLoading,
  } = useRandomImageByTitle(title);

  const tabs = [
    {
      key: 'posts',
      title: 'Noticias',
      component: (
        <>
          <SectionTitle
            title="Noticias"
            subtitle="Cantidad de noticias relacionados"
            fancyText={titleData?.result?.posts?.length}
          />
          <OtherArticles
            articles={titleData?.result?.posts}
            total={titleData?.result?.posts?.length}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Modal title="Consentimiento" isOpen={isOpen} toggleModal={toggleModal}>
        <p className="py-4">Eres tu mayor de 18 años?</p>
        <div className="flex flex-row w-full justify-around">
          <Button
            onClick={() => {
              setCensored(false);
              toggleModal();
            }}
          >
            Si
          </Button>
          <Button onClick={toggleModal}>No</Button>
        </div>
      </Modal>
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
                    {!imageLoading && (
                      <Image
                        className={`${randomImage?.url ? '' : 'blur'} ${
                          censored ? 'blur-lg opacity-70' : ''
                        } w-full h-full`}
                        src={
                          randomImage?.url ??
                          titleData?.result?.images?.name ??
                          DEFAULT_IMAGE
                        }
                        alt={titleData?.result?.name}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    )}
                  </figure>
                  <div className="overlayer"></div>
                  <Permissions>
                    <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                      <Link href={`/dashboard/titles/${titleData?.result?.id}`}>
                        <a className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                          <PencilIcon className="w-5 h-5" />
                        </a>
                      </Link>
                    </div>
                  </Permissions>
                </div>
              </Section>
              <div className="title-content">
                <Section withContainer>
                  <div className="title-info container mx-auto px-8 md:p-4">
                    <div className="title-top-box overlap-banner">
                      <div className="title-image-box overlap-banner relative">
                        <figure className="title-image overlap-banner relative rounded group overflow-hidden">
                          <Image
                            className={`w-[300px] h-[380px] object-cover object-center mx-auto ${
                              censored ? 'blur' : ''
                            }`}
                            src={
                              titleData?.result?.images?.name ?? DEFAULT_IMAGE
                            }
                            layout="fill"
                            objectFit="cover"
                          />
                          {censored && (
                            <>
                              <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center">
                                <Image
                                  src="/images/censored.png"
                                  alt="Censurado"
                                  height={100}
                                  width={200}
                                  className="absolute top-0 right-0"
                                />
                              </div>
                              <button
                                className="absolute group-hover:bottom-2 -bottom-12 right-3 transition-all px-4 py-1 bg-gray-400 rounded-md text-white"
                                onClick={() => toggleModal()}
                              >
                                {censored ? 'Ver imagen' : 'Ocultar imagen'}
                              </button>
                            </>
                          )}
                        </figure>
                        <div className="w-[290px] flex justify-between mx-auto mt-4">
                          {user ? (
                            <>
                              {titleData?.result?.type?.id !== 8 && (
                                <div className="relative">
                                  <Statistics
                                    serie={titleData?.result}
                                    statistics={titleData?.statistics}
                                    userStatistics={
                                      userStatistics?.data?.statistics
                                    }
                                    refetch={refetchStatistics}
                                  />
                                </div>
                              )}
                              <div className="relative">
                                <Rates
                                  serie={titleData?.result}
                                  rates={titleData?.rates}
                                  userRates={userRates?.data?.rates}
                                  refetch={refetchRates}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="relative">
                                <Link href="/login">
                                  <a className="flex items-center text-sm font-medium rounded-lg py-1 px-2 bg-orange-100 text-gray-500 hover:text-gray-700">
                                    <div className="mr-1">
                                      <PlusSmIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-row justify-start items-center gap-4 relative">
                                      Watch Options
                                    </div>
                                  </a>
                                </Link>
                              </div>
                              <div className="relative">
                                <Link href="/login">
                                  <a className="flex items-center text-sm font-medium rounded-lg py-1 px-2 bg-orange-100 text-gray-500 hover:text-gray-700">
                                    <div className="mr-1">
                                      <PlusSmIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-row justify-start items-center gap-4 relative">
                                      Rate Options
                                    </div>
                                  </a>
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="title-info-box mt-10 lg:mt-0">
                        <div className="title-name-box">
                          <h1 className="title-name md:text-lg lg:text-2xl xl:text-4xl text-center lg:text-left">
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
                                  ? dayjs(titleData?.result?.broadTime)
                                      .utc()
                                      .locale(es)
                                      .format('MMMM DD, YYYY')
                                  : 'Sin Información'}
                              </span>
                            }
                          />
                          <SerieItemInfo
                            title="Ultima Emisión"
                            value={
                              <span className="post-date">
                                {titleData?.result?.broadFinish
                                  ? dayjs(titleData?.result?.broadFinish)
                                      .utc()
                                      .locale(es)
                                      .format('MMMM DD, YYYY')
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
                              titleData?.result?.episodies || 'Sin Información'
                            }
                          />
                          <SerieItemInfo
                            title="Clasificación"
                            value={`${titleData?.result?.rating?.name} (${titleData?.result?.rating?.description})`}
                          />
                          <SerieItemInfo
                            title="Estatus"
                            value={
                              titleData?.result?.status ? (
                                <div
                                  className={`text-center border-2 rounded-md px-1 max-w-[100px] ${
                                    STATUS_COLORS[
                                      status[titleData?.result?.status]
                                    ]
                                  }`}
                                >
                                  {titleData?.result?.status}
                                </div>
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
                        __html: titleData?.result?.sinopsis,
                      }}
                    ></div>
                  </div>
                </Section>
                <Section withContainer>
                  <FlexLayout direction="row" justify="start" className="px-4">
                    {tabs.map((item) => (
                      <Tabs
                        key={item.key}
                        active={activeTab === item.key}
                        onClick={() => setActiveTab(item.key)}
                      >
                        {item.title}
                      </Tabs>
                    ))}
                  </FlexLayout>
                </Section>
              </div>
              <Section withContainer>
                {titleData?.result?.posts?.length > 0 ? (
                  <FlexLayout gap={2}>
                    {tabs.map((item) => (
                      <TabsContent
                        key={item.key}
                        active={activeTab === item.key}
                      >
                        {item.component}
                      </TabsContent>
                    ))}
                  </FlexLayout>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-400">
                      Sin Publicaciones
                    </h2>
                  </div>
                )}
              </Section>
            </div>
          </>
        )}
      </WebLayout>
    </>
  );
};

export async function getServerSideProps({ params }) {
  let res = null;
  let errors = null;
  let titleData = null;
  const { type, title } = params;
  try {
    res = await getTitle({ type, title });
    titleData = res.data;
  } catch (error) {
    if (error?.response?.data?.message?.text) {
      errors = error.response.data.message.text;
    } else if (error.message) {
      errors = error.message;
    } else {
      errors = error;
    }
  }

  return {
    props: {
      type,
      title,
      titleData,
      errors,
      revalidate: 5 * 60,
    },
  };
}

export default Titles;
