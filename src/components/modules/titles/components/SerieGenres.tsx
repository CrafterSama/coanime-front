import Link from 'next/link';

const SerieGenres = ({ genres }) => (
  <div className="text-center text-white">
    {genres?.map((genre, index) => (
      <>
        <span key={genre?.id}>
          <Link href={`/ecma/generos/${genre?.slug}`}>
            <a className="text-xs font-semibold">{genre?.name}</a>
          </Link>
        </span>
        {genres?.length === index + 1 ? '' : ', '}
      </>
    ))}
  </div>
);

export default SerieGenres;
