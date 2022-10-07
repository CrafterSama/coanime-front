import Image from 'next/image';
import Link from 'next/link';

import SerieGenres from '@/components/modules/titles/components/SerieGenres';

const defaultImage =
  'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg';

const SerieCard = ({ serie }) => {
  return (
    <div className="title-item">
      <Image
        src={serie?.images?.name ?? defaultImage}
        alt={serie?.name}
        layout="fill"
        className={`w-full h-full ${serie?.ratingId === 6 ? 'blur-lg' : ''}`}
        objectFit="cover"
      />
      {serie?.ratingId === 6 && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex flex-col justify-center items-center">
          <Image
            src="/images/censored.png"
            alt="Censurado"
            height={70}
            width={150}
            className="absolute top-0 right-0"
          />
        </div>
      )}
      <div className="overlayer"></div>
      <div className="absolute top-0 right-0 left-0 bottom-0 p-2 grid grid-cols-1 grid-rows-2 gap-2">
        <div className="categories text-right">
          <Link href={`/ecma/titulos/${serie?.type?.slug}`}>
            <a>{serie?.type?.name}</a>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center content-end">
          <Link href={`/ecma/titulos/${serie?.type?.slug}/${serie?.slug}`}>
            <a className="text-white text-center text-xl font-semibold w-full">
              {serie?.name}
            </a>
          </Link>
          <SerieGenres genres={serie?.genres} />
        </div>
      </div>
    </div>
  );
};

export default SerieCard;
