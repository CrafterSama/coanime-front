import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';
import { DEFAULT_IMAGE } from '@/constants/common';

export const headers = [
  {
    name: 'Imagen y Nombre',
    accessor: (row: any) => row,
    cell: (row) => (
      <div className="flex flex-row gap-2 w-96">
        <div className="w-4/12 h-46">
          <Link
            href={`/dashboard/companies/${row?.id}`}
            className="relative flex h-[170px] w-full">
            <Image
              unoptimized
              className="rounded-lg object-scale-down bg-gray-200"
              src={
                row?.image?.name
                  ? `https://api.coanime.net/storage/images/encyclopedia/companies/${row?.image?.name}`
                  : DEFAULT_IMAGE
              }
              alt={row?.name}
              loading="lazy"
              fill
            />
          </Link>
        </div>
        <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
          <Link
            href={`/dashboard/companies/${row?.slug}`}
            className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
            <h4 className="text-sm">{row?.name}</h4>
          </Link>
          <p className="text-gray-600 text-xs">
            {strLimit(extractText(row?.about), 150)}
          </p>
        </div>
      </div>
    ),
    firstItem: true,
    fixed: true,
    headerClassName: 'w-72',
  },
  {
    name: 'Ciudad/Pais',
    accessor: (row: any) => row,
    cell: (row) => {
      const name = JSON.parse(row?.country?.translations);
      return (
        <div className="w-40 flex flex-row gap-2 text-sm">
          <span>{`${row?.country?.emoji} ${name['es']}`}</span>
        </div>
      );
    },
  },
  {
    name: 'Agregado el',
    accessor: (row: any) => row,
    cell: ({ createdAt, updatedAt }) => (
      <div className="w-40 flex">
        {createdAt
          ? dayjs(createdAt).format('DD/MM/YYYY HH:mm a')
          : dayjs(updatedAt).format('DD/MM/YYYY HH:mm a')}
      </div>
    ),
  },
];
