import { FC } from 'react';

import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Thumbs,
  Virtual,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import BroadcastSerieCard from '@/components/modules/home/components/BroadcastSerieCard';
import Loading from '@/components/ui/Loading';

type BroadcastTodayProps = {
  broadcast?: any[];
};

const BroadcastToday: FC<BroadcastTodayProps> = ({ broadcast = [] }) => {
  /*const { data: today, isLoading } = useQuery(['posts'], getBroadcastToday, {
    initialData: broadcastData,
  });*/

  const series = broadcast?.filter((item) => item.approved === true) ?? [];

  return (
    <>
      {!broadcast && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      {series?.length > 0 && (
        <div className="broadcast-today px-4 xl:px-0">
          <Swiper
            className="flex"
            modules={[
              EffectFade,
              Navigation,
              Pagination,
              A11y,
              Thumbs,
              Virtual,
            ]}
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
                <BroadcastSerieCard serie={serie} position={index + 1} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default BroadcastToday;
