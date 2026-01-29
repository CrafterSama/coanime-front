import { FC } from 'react';

import SerieCard from '@/components/modules/titles/components/serie-card';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import { CarouselSkeleton } from '@/components/ui/carousel-skeleton';
import { getBroadcastToday } from '@/services/home';
import { useQuery } from '@tanstack/react-query';

type SeriesSoonProps = {
  broadcastData?: any;
};

const SeriesSoon: FC<SeriesSoonProps> = ({ broadcastData }) => {
  const { data: today, isLoading } = useQuery(['posts'], getBroadcastToday, {
    initialData: broadcastData,
  });

  const series =
    today?.data?.filter((item: any) => item.approved === true) ?? [];

  return (
    <>
      {isLoading && <CarouselSkeleton items={6} />}
      {series.length > 0 && (
        <div className="broadcast-today px-4 xl:px-0">
          <HorizontalCarousel gap={16}>
            {series.map((serie: any, index: number) => (
              <SerieCard key={serie.id ?? index} serie={serie} />
            ))}
          </HorizontalCarousel>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const response = await getBroadcastToday();
  return { props: { broadcastData: response } };
}

export default SeriesSoon;
