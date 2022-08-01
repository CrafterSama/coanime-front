import { useEffect, useState } from 'react';

import Image from 'next/image';
import { Navigation, Pagination, A11y, Thumbs, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Loading from '@/components/ui/Loading';
import { useBroadcastToday } from '@/hooks/home';

const BroadcastToday = () => {
  const { data: series = {}, isLoading } = useBroadcastToday();

  console.log(series);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      {series.length > 0 && (
        <Swiper
          modules={[EffectFade, Navigation, Pagination, A11y, Thumbs]}
          slidesPerView={6}
          loop={true}
          autoplay={{
            delay: 5000,
          }}
          spaceBetween={16}
          navigation={true}
        >
          {series?.map((serie) => (
            <SwiperSlide key={serie.id}>
              <div className="h-72 w-48 relative rounded overflow-hidden bg-slate-200">
                <Image
                  src={serie.images.webp.large_image_url}
                  alt={serie.title}
                  className="w-full h-full"
                  objectFit="contain"
                  layout="fill"
                  quality={90}
                />
                <div className="absolute left-0 right-0 bottom-0 h-auto p-2 bg-white bg-opacity-80 text-indigo-900 flex justify-center items-center text-center text-xs">
                  <span>{serie.title}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default BroadcastToday;
