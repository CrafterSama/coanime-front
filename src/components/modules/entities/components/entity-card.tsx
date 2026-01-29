import Image from 'next/image';
import Link from 'next/link';

const defaultImage =
  'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg';

import React from 'react';

const EntityCard = ({ entity }: { entity: any }) => (
  <div className="title-item overflow-hidden py-4">
    <Image
      src={
        entity?.image?.name
          ? `https://api.coanime.net/storage/images/encyclopedia/companies/${entity?.image?.name}`
          : defaultImage
      }
      alt={entity?.name}
      fill
      className="w-full h-full"
      unoptimized
    />
    <div className="overlayer"></div>
    <div className="absolute top-0 right-0 left-0 bottom-0 p-2 grid grid-cols-1 grid-rows-2 gap-2">
      <div className="categories flex justify-between items-start py-1">
        <span className="text-2xl">{entity?.country?.emoji}</span>
        <Link
          href={`/ecma/entidades/pais/${entity?.country?.name.toLowerCase()}`}>
          {entity?.country?.name}
        </Link>
      </div>
      <div className="flex flex-wrap justify-center content-end">
        <Link
          href={`/ecma/entidades/${entity?.slug}`}
          className="text-white text-center text-xl font-semibold w-full">
          {entity?.name}
        </Link>
        <div className="text-white">{entity?.release?.name}</div>
      </div>
    </div>
  </div>
);

export default EntityCard;
