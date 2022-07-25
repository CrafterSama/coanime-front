import dayjs from 'dayjs';
import Image from 'next/future/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';

export const headers = [
  {
    name: 'Imagen y Nombre',
    accessor: (row: any) => row,
    cell: (row) => (
      <div className="flex flex-row gap-2 w-96">
        <div className="w-4/12 h-46">
          <Link href={`/magazine/${row?.slug}`}>
            <a>
              <Image
                className="rounded-lg w-full h-full"
                src={`https://coanime.net/images/encyclopedia/magazine/${row?.image?.name}`}
                alt={row?.name}
                loading="lazy"
                width="100%"
                height="100%"
              />
            </a>
          </Link>
        </div>
        <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
          <Link href={`/magazine/${row?.slug}`}>
            <a className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <h4 className="text-sm">{row?.name}</h4>
            </a>
          </Link>
          <p className="text-gray-600 text-xs">
            {strLimit(extractText(row?.about), 150)}
          </p>
          <p className="text-gray-600 text-xs">
            Demografia : {row?.type?.name}
          </p>
        </div>
      </div>
    ),
    firstItem: true,
    fixed: true,
    headerClassName: 'w-72',
  },
  {
    name: 'Tiempo de Publicación',
    accessor: (row: any) => row,
    cell: ({ release }) => (
      <div className="w-60 flex justify-center items-center text-sm">
        {release?.name}
      </div>
    ),
  },
  {
    name: 'Ciudad/Pais',
    accessor: (row: any) => row,
    cell: ({ country }) => (
      <div className="w-40 flex flex-row gap-2 text-sm">
        <span>{`${country?.emoji} ${country?.name}`}</span>
      </div>
    ),
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
