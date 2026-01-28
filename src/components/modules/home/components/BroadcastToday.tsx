import { FC } from 'react';

import BroadcastSerieCard from '@/components/modules/home/components/BroadcastSerieCard';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import { CarouselSkeleton } from '@/components/ui/carousel-skeleton';

type BroadcastTodayProps = {
  broadcast?: any[];
};

const BroadcastToday: FC<BroadcastTodayProps> = ({ broadcast = [] }) => {
  const series = broadcast?.filter((item) => item.approved === true) ?? [];

  return (
    <>
      {!broadcast && <CarouselSkeleton items={6} />}
      {series.length > 0 && (
        <div className="px-4 xl:px-0">
          <HorizontalCarousel className="broadcast-today" gap={16}>
            {series.map((serie, index) => (
              <BroadcastSerieCard
                key={serie.id ?? index}
                serie={serie}
                position={index + 1}
              />
            ))}
          </HorizontalCarousel>
        </div>
      )}
    </>
  );
};

export default BroadcastToday;
