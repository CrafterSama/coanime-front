import { FC } from 'react';
import { useQuery } from 'react-query';

import {
  A11y,
  EffectFade,
  Navigation,
  Pagination,
  Thumbs,
  Virtual,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import SerieCard from '@/components/modules/titles/components/SerieCard';
import Loading from '@/components/ui/Loading';
import { getBroadcastToday } from '@/services/home';

type BroadcastTodayProps = {
  broadcastData?: any;
};

const BroadcastToday: FC<BroadcastTodayProps> = ({ broadcastData }) => {
  const { data: today, isLoading } = useQuery(['posts'], getBroadcastToday, {
    initialData: broadcastData,
  });

  const series = today?.data?.filter((item) => item.approved === true) ?? [];

  return (
    <>
      {isLoading && (
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
                <SerieCard serie={serie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const response = await getBroadcastToday();

  const broadcastData = response;

  return { props: { broadcastData } };
}

export default BroadcastToday;
