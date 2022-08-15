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
import { getBroadcastToday } from '@/hooks/home';
import { defaultImage, getTitlesUrl } from '@/utils/string';

type BroadcastTodayProps = {
  broadcastData?: any;
};

const BroadcastToday: FC<BroadcastTodayProps> = ({ broadcastData }) => {
  const { data: today, isLoading } = useQuery(['posts'], getBroadcastToday, {
    initialData: broadcastData,
  });
  // @ts-ignore
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
              delay: 5000,
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
                <div className="h-72 w-48 relative rounded overflow-hidden bg-slate-200">
                  <Image
                    src={defaultImage(serie?.images?.webp?.large_image_url)}
                    alt={serie?.title}
                    className="w-full h-full"
                    objectFit="contain"
                    layout="fill"
                    quality={90}
                  />
                  <div className="absolute left-0 right-0 bottom-0 h-auto p-2 bg-white bg-opacity-80 text-indigo-900 flex justify-center items-center text-center text-xs">
                    <Link href={getTitlesUrl(serie?.type, serie?.title)}>
                      <a>{serie?.title}</a>
                    </Link>
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

export async function getServerSideProps() {
  const response = await getBroadcastToday();

  const broadcastData = response;

  return { props: { broadcastData } };
}

export default BroadcastToday;
