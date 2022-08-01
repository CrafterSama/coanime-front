import { useState } from 'react';

import { format } from 'date-fns';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Pagination, A11y, Thumbs, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import WebLayout from '@/components/Layouts/WebLayout';
import Loading from '@/components/ui/Loading';
import { useHome } from '@/hooks/home';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/outline';

export default function Home() {
  const { data = {}, isLoading } = useHome();
  const { title = '', description = '', keywords = '', relevants = [] } = data;

  console.log(data);

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <section className="mb-4">
        <div className="top-slider">
          <div className="flex flex-col gap-4 relative">
            <Swiper
              modules={[EffectFade, Navigation, Pagination, A11y, Thumbs]}
              slidesPerView={1}
              pagination={{
                clickable: true,
              }}
              loop={true}
              autoplay={{ delay: 2000 }}
              className="flex flex-row gap-8 w-full"
            >
              {relevants.map((relevant) => (
                <SwiperSlide key={relevant.id}>
                  <div className="flex relative min-h-screen">
                    <Image
                      src={relevant.image}
                      alt={relevant.title}
                      className="w-full h-full"
                      objectFit="cover"
                      layout="fill"
                    />
                    <div className="overlayer" />
                    <div className="carousel-caption text-shadow pl-4 border-l-1 hover:border-l-2 border-orange-400 transition-all">
                      <h3 className="text-white text-2xl font-semibold">
                        Noticias Destacadas
                      </h3>
                      <h2 className="font-bold">
                        <Link href={`/posts/${relevant.slug}`}>
                          <a className="text-white font-semibold">
                            {relevant?.title}
                          </a>
                        </Link>
                      </h2>
                      <div className="flex flex-col gap-2">
                        <p>{relevant.excerpt}</p>
                        <p className="flex flex-row gap-2 text-gray-400">
                          <UserCircleIcon className="w-6 h-6" />
                          <span className="text-white">
                            {relevant.users.name}
                          </span>
                        </p>
                        <p className="flex flex-row gap-2 text-gray-400">
                          <ClockIcon className="w-6 h-6" />
                          <span className="text-gray-300">
                            {format(
                              new Date(relevant.postponedTo),
                              'd LLLL, yyyy'
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="container max-w-7xl mx-auto">
        <h2 className="lg:text-4xl md:text-2xl sm:text-lg font-bold mb-8 pb-4 border-b border-orange-400">
          Populares
        </h2>
        <div className="recent-posts">
          {data?.result?.map((post) => (
            <div key={post.id} className="box">
              <div className="box__item">
                <figure className="item__image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full"
                    objectFit="cover"
                    layout="fill"
                    quality={90}
                  />
                </figure>
                <div className="overlayer"></div>
                <div className="item__info text-shadow bottom-attach flex flex-col gap-2">
                  <div className="categories">
                    <Link href={`/categories/${post?.categories?.slug}`}>
                      <a>{post?.categories?.name}</a>
                    </Link>
                  </div>
                  <h2 className="info__news-title">
                    <Link href={`/posts/${post?.slug}`}>
                      <a>{post?.title}</a>
                    </Link>
                  </h2>
                  <h4 className="info__news-sub-title">{post?.excerpt}</h4>
                  <p className="flex flex-row gap-4">
                    <span className="flex flex-row gap-2">
                      <UserCircleIcon className="w-6 h-6" />
                      <span className="text-gray-300">{post?.users?.name}</span>
                    </span>
                    <span className="flex flex-row gap-2">
                      <ClockIcon className="w-6 h-6" />
                      <span className="text-gray-300">
                        {format(new Date(post?.postponedTo), 'd LLLL, yyyy')}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </WebLayout>
  );
}
