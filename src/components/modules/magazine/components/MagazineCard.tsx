import Image from 'next/image';
import Link from 'next/link';

const defaultImage =
  'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg';

const MagazineCard = ({ magazine }) => (
  <div className="title-item overflow-hidden py-4">
    <Image
      src={
        magazine?.image?.name
          ? `https://coanime.net/images/encyclopedia/magazine/${magazine?.image?.name}`
          : defaultImage
      }
      alt={magazine?.name}
      layout="fill"
      className="w-full h-full"
      objectFit="cover"
    />
    <div className="overlayer"></div>
    <div className="absolute top-0 right-0 left-0 bottom-0 p-2 grid grid-cols-1 grid-rows-2 gap-2">
      <div className="categories flex justify-between items-start py-1">
        <span className="text-2xl">{magazine?.country?.emoji}</span>
        <Link href={`/ecma/revistas/${magazine?.type?.slug}`}>
          <a>{magazine?.type?.name}</a>
        </Link>
      </div>
      <div className="flex flex-wrap justify-center content-end">
        <Link href={`/ecma/revistas/${magazine?.slug}`}>
          <a className="text-white text-center text-xl font-semibold w-full">
            {magazine?.name}
          </a>
        </Link>
        <div className="text-white">{magazine?.release?.name}</div>
      </div>
    </div>
  </div>
);

export default MagazineCard;
