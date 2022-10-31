import Link from 'next/link';

const SerieGenres = ({ genres }) => (
  <div className="text-center text-white">
    {genres?.map((genre, index) => (
      <span key={genre?.id}>
        <span>
          <Link href={`/ecma/generos/${genre?.slug}`} className="text-xs font-semibold">
            {genre?.name}
          </Link>
        </span>
        {genres?.length === index + 1 ? '' : ', '}
      </span>
    ))}
  </div>
);

export default SerieGenres;
