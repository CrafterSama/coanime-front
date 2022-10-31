import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';
import { defaultImage, getTitlesUrl } from '@/utils/string';

const BroadcastSerieCard = ({ serie, position }) => (
  <div className="h-72 w-52 relative rounded overflow-hidden bg-gray-100 p-2">
    <Image
      src={
        serie?.images?.webp?.largeImageUrl
          ? defaultImage(serie?.images?.webp?.largeImageUrl)
          : DEFAULT_IMAGE
      }
      alt={serie?.title}
      className="w-full h-full object-contain"
      fill
      quality={90}
    />
    <div className="absolute left-0 right-0 bottom-0 h-auto p-2 bg-gray-900 bg-opacity-80 text-white flex justify-center items-center text-center text-xs rounded-b">
      <Link href={getTitlesUrl(serie?.type, serie?.title)} className="text-sm">
        {serie?.title}
      </Link>
    </div>
    <div
      className={`absolute top-0 right-0 h-4 w-4 p-1 rounded-full bg-white bg-opacity-80 text-orange-500 flex justify-center items-center text-center text-xs`}>
      {position}
    </div>
  </div>
);

export default BroadcastSerieCard;
