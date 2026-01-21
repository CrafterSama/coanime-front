import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Pagination, A11y, Thumbs, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { DEFAULT_IMAGE } from '@/constants/common';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const TopSlider = ({ relevants }) => (
  <div className="top-slider">
    <div className="flex flex-col gap-4 relative">
      <Swiper
        modules={[EffectFade, Navigation, Pagination, A11y, Thumbs]}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        loop={true}
        autoplay={{ delay: 1500 }}
        className="flex flex-row gap-8 w-full">
        {relevants?.map((relevant) => (
          <SwiperSlide key={relevant.id}>
            <div className="top-slider flex relative min-h-screen">
              <Image
                src={relevant.image ?? DEFAULT_IMAGE}
                alt={`${relevant.title} - Coanime.net`}
                quality={90}
                className="object-cover"
                fill
                unoptimized
              />
              <div className="overlayer" />
              <div className="carousel-caption text-shadow flex flex-col gap-2">
                <h4 className="text-white text-xl">Noticias Destacadas</h4>
                <h2 className="font-bold">
                  <Link
                    href={`/posts/[slug]`}
                    as={`/posts/${relevant.slug}`}
                    className="text-white font-semibold">
                    {relevant?.title}
                  </Link>
                </h2>
                <div className="flex flex-col gap-2">
                  <h3 className="sub-title">{relevant.excerpt}</h3>
                  <div className="flex flex-row gap-4">
                    <p className="flex flex-row gap-2 text-gray-400">
                      <UserCircleIcon className="w-6 h-6" />
                      <Link
                        href={`/users/[slug]`}
                        as={`/users/${relevant?.users?.slug}`}
                        className="text-gray-300">
                        {relevant?.users?.name}
                      </Link>
                    </p>
                    <p className="flex flex-row gap-2 text-gray-400">
                      <ClockIcon className="w-6 h-6" />
                      <span className="text-gray-300">
                        {dayjs(
                          relevant?.postponedTo
                            ? relevant?.postponedTo
                            : relevant?.createdAt
                        )
                          .locale('es')
                          .format('D MMMM, YYYY')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
);

export default TopSlider;
