import { FC } from 'react';
import { useQuery } from 'react-query';

import Image from 'next/image';
import Link from 'next/link';
import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Thumbs,
  Virtual,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Loading from '@/components/ui/Loading';
import { getBroadcastToday } from '@/services/home';
import { defaultImage, getTitlesUrl } from '@/utils/string';
import { DEFAULT_IMAGE } from '@/constants/common';

type BroadcastTodayProps = {
  broadcast?: any[];
};

const BroadcastToday: FC<BroadcastTodayProps> = ({ broadcast }) => {
  /*const { data: today, isLoading } = useQuery(['posts'], getBroadcastToday, {
    initialData: broadcastData,
  });*/

  const series = broadcast.filter((item) => item.approved === true) ?? [];
  console.log('🚀 ~ file: BroadcastToday.tsx ~ line 31 ~ series', series);

  return (
    <>
      {!broadcast && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      {series.length > 0 && (
        <div className="broadcast-today px-4 xl:px-0">
          <Swiper
            modules={[
              EffectFade,
              Navigation,
              Pagination,
              A11y,
              Thumbs,
              Virtual,
            ]}
            loop={true}
            autoplay={{
              delay: 1000,
            }}
            navigation={true}
            breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
          >
            {series?.map((serie, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <div className="h-72 w-48 relative rounded-lg overflow-hidden bg-gray-500">
                  <Image
                    src={
                      serie?.images?.webp?.largeImageUrl
                        ? defaultImage(serie?.images?.webp?.largeImageUrl)
                        : DEFAULT_IMAGE
                    }
                    alt={serie?.title}
                    className="w-full h-full"
                    objectFit="contain"
                    layout="fill"
                    quality={90}
                  />
                  <div className="absolute left-0 right-0 bottom-0 h-auto p-2 bg-gray-900 bg-opacity-80 text-white flex justify-center items-center text-center text-xs rounded-b">
                    <Link href={getTitlesUrl(serie?.type, serie?.title)}>
                      <a className="text-sm">{serie?.title}</a>
                    </Link>
                  </div>
                  <div
                    className={`absolute top-0 right-0 h-4 w-4 p-1 rounded-full bg-white bg-opacity-80 text-orange-500 flex justify-center items-center text-center text-xs`}
                  >
                    {index + 1}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default BroadcastToday;
