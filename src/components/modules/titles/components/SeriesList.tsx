import { FC } from 'react';

import SerieCard from '@/components/modules/titles/components/SerieCard';

type SeriesListProps = {
  series: any[];
};

const SeriesList: FC<SeriesListProps> = ({ series }) => (
  <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[90vh]">
    {series?.map((serie) => (
      <SerieCard key={serie?.id} serie={serie} />
    ))}
  </div>
);

export default SeriesList;
