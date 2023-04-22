/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import {
  FaFacebookSquare,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from 'react-icons/fa';

import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import OtherArticles from '@/components/modules/posts/components/OtherArticles';
import SeriesList from '@/components/modules/titles/components/SeriesList';
import FlexLayout from '@/components/ui/FlexLayout';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import {
  usePostsByUser,
  useProfileByUser,
  useTitlesByUser,
} from '@/hooks/users';
import { LinkIcon, PencilIcon } from '@heroicons/react/outline';

const imageFalse = 'https://api.coanime.net/storage/images/profiles/';

const Profile = ({ slug }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [postsPage, setPostsPage] = useState(1);
  const [titlesPage, setTitlesPage] = useState(1);
  const { user } = useAuth({ middleware: 'auth' });
  const { data = {}, isLoading } = useProfileByUser({ slug });
  const { data: posts = [], isLoading: isLoadingPosts } = usePostsByUser({
    id: data?.result?.id,
    page: postsPage,
  });
  const { data: titles = [] } = useTitlesByUser({
    id: data?.result?.id,
    page: titlesPage,
  });

  const tabs = [
    {
      key: 'posts',
      title: 'Noticias',
      component: (
        <>
          <SectionTitle
            title="Noticias destacadas"
            subtitle="agregadas por el usuario"
            fancyText={posts?.result?.total}
          />
          <OtherArticles
            articles={posts?.result?.data}
            total={posts?.result?.total}
          />
          <Paginator
            page={postsPage}
            setPage={setPostsPage}
            data={posts?.result}
          />
        </>
      ),
    },
    {
      key: 'titles',
      title: `Titulos`,
      component: (
        <>
          <SectionTitle
            title="Titulos"
            subtitle="agregados por el usuario"
            fancyText={titles?.result?.total}
          />
          <SeriesList
            series={titles?.result?.data}
            total={titles?.result?.total}
          />
          <Paginator
            page={titlesPage}
            setPage={setTitlesPage}
            data={titles?.result}
          />
        </>
      ),
    },
  ];
  return (
    <>
      {data && (
        <Head>
          <title>{data?.title}</title>
          <meta name="description" content={data?.description} />
        </Head>
      )}
      <WebLayout>
        {isLoading && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading showFancySpiner size={20} />
          </div>
        )}
        {data && (
          <>
            <div id="title">
              <Section>
                <div className="title-header">
                  <figure className="title-header-image relative">
                    <Image
                      className={`${
                        data?.result?.profileCoverPath ? '' : 'blur'
                      } w-full h-full`}
                      src={
                        data?.result?.profileCoverPath
                          ? data?.result?.profileCoverPath
                          : DEFAULT_IMAGE
                      }
                      alt={data?.result?.name}
                      fill
                      unoptimized
                    />
                  </figure>
                  <div className="overlayer"></div>
                  {user && user.id === data?.result?.id && (
                    <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                      <Link
                        href={`/perfil/edit`}
                        className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  )}
                </div>
              </Section>
              <div className="title-content pb-0">
                <Section withContainer>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-10">
                      <figure className="title-content-image mx-auto lg:mx-0 relative w-64 h-64 rounded-full overflow-hidden p-2 bg-white -mt-20 box-border">
                        <img
                          src={
                            !data?.result?.profilePhotoPath
                              ? DEFAULT_IMAGE
                              : data?.result?.profilePhotoPath === imageFalse
                              ? DEFAULT_IMAGE
                              : data?.result?.profilePhotoPath
                          }
                          alt={data?.result?.name}
                          className="rounded-full m-auto w-60 h-60"
                        />
                        {user && user.id === data?.result?.id && (
                          <div className="absolute bottom-0 left-[40%] px-2 py-2 flex flex-col gap-4">
                            <Link
                              href={`/perfil/edit`}
                              className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                          </div>
                        )}
                      </figure>
                      <div className="flex flex-col justify-center items-center lg:items-start">
                        <h1 className="text-2xl font-bold text-center lg:text-left">
                          {data?.result?.name}
                          {' // '}
                          <span className="text-orange-400">
                            {data?.result?.username}
                          </span>
                        </h1>
                        <p
                          className="text-center text-gray-400 mb-2"
                          dangerouslySetInnerHTML={{
                            __html: data?.result?.bio,
                          }}
                        />
                        <div className="flex flex-row text-center lg:text-left gap-2 mb-2">
                          <span className="flex flex-row gap-2">
                            <h5 className="text-base font-bold">
                              Activo(a) desde:
                            </h5>{' '}
                            <p className="text-gray-500">
                              {dayjs(data?.result?.createdAt).format(
                                'DD/MM/YYYY'
                              )}
                            </p>
                          </span>
                        </div>
                        <div className="flex flex-row gap-2">
                          {data?.result?.website && (
                            <Link
                              href={data?.result?.website ?? ''}
                              target="_blank"
                              className="text-orange-500 text-center">
                              <LinkIcon className="w-5 h-5" />
                            </Link>
                          )}
                          {data?.result?.facebook && (
                            <Link
                              href={data?.result?.facebook ?? ''}
                              target="_blank"
                              className="text-blue-500 text-center">
                              <FaFacebookSquare className="w-5 h-5" />
                            </Link>
                          )}
                          {data?.result?.twitter && (
                            <Link
                              href={data?.result?.twitter ?? ''}
                              target="_blank"
                              className="text-cyan-500 text-center">
                              <FaTwitter className="w-5 h-5" />
                            </Link>
                          )}
                          {data?.result?.instagram && (
                            <Link
                              href={data?.result?.instagram ?? ''}
                              target="_blank"
                              className="text-fuchsia-400 text-center">
                              <FaInstagram className="w-5 h-5" />
                            </Link>
                          )}
                          {data?.result?.pinterest && (
                            <Link
                              href={data?.result?.pinterest ?? ''}
                              target="_blank"
                              className="text-red-500 text-center">
                              <FaPinterest className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
                <Section withContainer>
                  <FlexLayout direction="row" justify="start" className="px-4">
                    {tabs.map((item) => (
                      <Tabs
                        key={item.key}
                        active={activeTab === item.key}
                        onClick={() => setActiveTab(item.key)}>
                        {item.title}
                      </Tabs>
                    ))}
                  </FlexLayout>
                </Section>
              </div>
              <Section withContainer>
                {!isLoadingPosts && (
                  <FlexLayout gap={2}>
                    {tabs.map((item) => (
                      <TabsContent
                        key={item.key}
                        active={activeTab === item.key}>
                        {item.component}
                      </TabsContent>
                    ))}
                  </FlexLayout>
                )}
              </Section>
            </div>
          </>
        )}
      </WebLayout>
    </>
  );
};

export default Profile;

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  return {
    props: {
      slug,
      revalidate: 5 * 60,
    },
  };
};
