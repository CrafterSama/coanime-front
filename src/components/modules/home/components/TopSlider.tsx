import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Pagination, A11y, Thumbs, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { DEFAULT_IMAGE } from '@/constants/common';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/outline';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
        autoplay={{ delay: 2000 }}
        className="flex flex-row gap-8 w-full"
      >
        {relevants.map((relevant) => (
          <SwiperSlide key={relevant.id}>
            <div className="flex relative min-h-screen">
              <Image
                src={relevant.image ?? DEFAULT_IMAGE}
                alt={relevant.title}
                className="w-full h-full"
                objectFit="cover"
                layout="fill"
                quality={90}
              />
              <div className="overlayer" />
              <div className="carousel-caption text-shadow">
                <h3 className="text-white text-2xl font-semibold">
                  Noticias Destacadas
                </h3>
                <h2 className="font-bold">
                  <Link href={`/posts/[slug]`} as={`/posts/${relevant.slug}`}>
                    <a className="text-white font-semibold">
                      {relevant?.title}
                    </a>
                  </Link>
                </h2>
                <div className="flex flex-col gap-2">
                  <p>{relevant.excerpt}</p>
                  <p className="flex flex-row gap-2 text-gray-400">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="text-white">{relevant.users.name}</span>
                  </p>
                  <p className="flex flex-row gap-2 text-gray-400">
                    <ClockIcon className="w-6 h-6" />
                    <span className="text-gray-300">
                      {format(
                        new Date(
                          relevant?.postponedTo
                            ? relevant?.postponedTo
                            : relevant?.createdAt
                        ),
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
);

export default TopSlider;
