import { FC } from 'react';

import SerieCard from '@/components/modules/titles/components/SerieCard';

type SeriesListProps = {
  series: any[];
  total?: number;
};

const SeriesList: FC<SeriesListProps> = ({ series, total = null }) => (
  <div className="flex flex-wrap gap-2 justify-center px-4 py-2 min-h-[90vh]">
    {total === 0 && (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-xl font-bold text-center text-gray-400">
          No hay resultados
        </h2>
      </div>
    )}
    {series?.map((serie) => <SerieCard key={serie?.id} serie={serie} />)}
  </div>
);

export default SeriesList;
