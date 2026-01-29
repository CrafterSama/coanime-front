import Link from 'next/link';

import React from 'react';

const SerieGenres = ({ genres }: { genres?: any[] }) => (
  <div className="text-center text-white">
    {genres?.map((genre: any, index: number) => (
      <span key={genre?.id}>
        <span>
          <Link
            href={`/ecma/generos/${genre?.slug}`}
            className="text-xs font-semibold">
            {genre?.name}
          </Link>
        </span>
        {genres?.length === index + 1 ? '' : ', '}
      </span>
    ))}
  </div>
);

export default SerieGenres;
