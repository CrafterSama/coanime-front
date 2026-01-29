import { FC } from 'react';

import UpcomingSerieCard from '@/components/modules/home/components/upcoming-serie-card';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import { CarouselSkeleton } from '@/components/ui/carousel-skeleton';

type UpcomingSeriesProps = {
  upcoming?: any[];
};

const UpcomingSeries: FC<UpcomingSeriesProps> = ({ upcoming = [] }) => {
  const series = upcoming ?? [];

  return (
    <>
      {!upcoming && <CarouselSkeleton items={6} />}
      {series.length > 0 && (
        <div className="broadcast-today px-4 xl:px-0">
          <HorizontalCarousel gap={16}>
            {series.map((serie, index) => (
              <UpcomingSerieCard key={serie.id ?? index} serie={serie} />
            ))}
          </HorizontalCarousel>
        </div>
      )}
    </>
  );
};

export default UpcomingSeries;
