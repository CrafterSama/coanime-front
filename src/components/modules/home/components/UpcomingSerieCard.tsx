import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';

dayjs.extend(utc);

const BroadcastSerieCard = ({ serie }) => (
  <div className="h-72 w-52 relative rounded overflow-hidden bg-gray-100 p-2">
    <Image
      src={serie?.images?.name ? serie?.images?.name : DEFAULT_IMAGE}
      alt={serie?.name}
      className="w-full h-full"
      objectFit="contain"
      layout="fill"
      quality={90}
    />
    <div className="absolute left-0 right-0 bottom-0 h-auto p-2 bg-gray-900 bg-opacity-80 text-white flex justify-center items-center text-center text-xs rounded-b">
      <Link href={`/ecma/titulos/${serie?.type?.slug}/${serie?.slug}`}>
        <a className="text-sm">{serie?.name}</a>
      </Link>
    </div>
    <div
      className={`absolute top-0 right-0 h-4 w-[68%] p-1 rounded-bl-xl bg-gray-900 bg-opacity-80 text-white flex justify-end items-center text-center text-xs`}
    >
      Estreno: {dayjs(serie.broadTime).utc().format('MMM DD, YYYY')}
    </div>
  </div>
);

export default BroadcastSerieCard;
