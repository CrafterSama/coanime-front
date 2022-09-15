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
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import { usePostsByUser, useProfileByUser } from '@/hooks/users';
import { LinkIcon, PencilIcon } from '@heroicons/react/outline';

const imageFalse = 'https://api.coanime.net/storage/images/profiles/';

const Profile = ({ slug }) => {
  const { user } = useAuth({ middleware: 'auth' });
  const router = useRouter();
  const { data = {}, isLoading } = useProfileByUser({ slug });
  const { data: posts = [], isLoading: isLoadingPosts } = usePostsByUser({
    id: data?.result?.id,
  });
  const [postsPage, setPostsPage] = useState(1);
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
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </figure>
                  <div className="overlayer"></div>
                  {user && user.id === data?.result?.id && (
                    <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                      <Link href={`/perfil/edit`}>
                        <a className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                          <PencilIcon className="w-5 h-5" />
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </Section>
              <div className="title-content">
                <Section withContainer>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-row gap-10">
                      <figure className="title-content-image relative w-64 h-64 rounded-full overflow-hidden p-2 bg-white -mt-20 box-border">
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
                            <Link href={`/perfil/edit`}>
                              <a className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                                <PencilIcon className="w-5 h-5" />
                              </a>
                            </Link>
                          </div>
                        )}
                      </figure>
                      <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-left">
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
                        <div className="flex flex-row gap-2 mb-2">
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
                            <Link href={data?.result?.website ?? ''}>
                              <a
                                target="_blank"
                                className="text-orange-500 text-center"
                              >
                                <LinkIcon className="w-5 h-5" />
                              </a>
                            </Link>
                          )}
                          {data?.result?.facebook && (
                            <Link href={data?.result?.facebook ?? ''}>
                              <a
                                target="_blank"
                                className="text-blue-500 text-center"
                              >
                                <FaFacebookSquare className="w-5 h-5" />
                              </a>
                            </Link>
                          )}
                          {data?.result?.twitter && (
                            <Link href={data?.result?.twitter ?? ''}>
                              <a
                                target="_blank"
                                className="text-cyan-500 text-center"
                              >
                                <FaTwitter className="w-5 h-5" />
                              </a>
                            </Link>
                          )}
                          {data?.result?.instagram && (
                            <Link href={data?.result?.instagram ?? ''}>
                              <a
                                target="_blank"
                                className="text-fuchsia-400 text-center"
                              >
                                <FaInstagram className="w-5 h-5" />
                              </a>
                            </Link>
                          )}
                          {data?.result?.pinterest && (
                            <Link href={data?.result?.pinterest ?? ''}>
                              <a
                                target="_blank"
                                className="text-red-500 text-center"
                              >
                                <FaPinterest className="w-5 h-5" />
                              </a>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
              <Section withContainer>
                {!isLoadingPosts && (
                  <>
                    <SectionTitle
                      title="Posts destacados"
                      subtitle="agregados por el usuario"
                      fancyText={posts?.result?.total}
                    />
                    <OtherArticles articles={posts?.result?.data} />
                  </>
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
