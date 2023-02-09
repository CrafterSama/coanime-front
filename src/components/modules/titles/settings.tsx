import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';
import { extractText, strLimit } from '@/utils/string';
import { LinkIcon } from '@heroicons/react/outline';

export const headers = [
  {
    name: 'Imagen y Nombre',
    accessor: (row: any) => row,
    cell: (row) => (
      <div className="flex flex-row gap-2 w-96">
        <div className="w-4/12 h-46">
          <Link href={`/dashboard/titles/${row?.id}`}>
            <div className="relative h-[120px] w-[80%]">
              <Image
                className="rounded-lg object-scale-down bg-gray-200"
                src={row?.images?.name ?? DEFAULT_IMAGE}
                alt={row?.name}
                loading="lazy"
                unoptimized
                fill
              />
            </div>
          </Link>
        </div>
        <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Link
              href={`/dashboard/titles/${row?.id}`}
              className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <h4 className="text-sm">{row?.name}</h4>
            </Link>
            <Link
              href={`/ecma/titulos/${row?.type?.slug}/${row?.slug}`}
              className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <LinkIcon className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-gray-600 text-xs">
            {strLimit(extractText(row?.sinopsis), 150)}
          </p>
          <p className="text-gray-500 text-xs">
            Otros Titulos: {row?.otherTitles}
          </p>
        </div>
      </div>
    ),
    firstItem: true,
    fixed: true,
    headerClassName: 'w-72',
  },
  {
    name: 'Tipo de Titulo',
    accessor: (row: any) => row,
    cell: ({ type }) => (
      <div className="w-40 flex justify-center items-center text-sm">
        {type?.name}
      </div>
    ),
  },
  {
    name: 'Clasificación',
    accessor: (row: any) => row,
    cell: ({ rating }) => (
      <div className="w-40 flex flex-row gap-2 text-sm">
        <span>{`${rating?.name}: ${rating?.description}`}</span>
      </div>
    ),
  },
  {
    name: 'Generos',
    accessor: (row: any) => row,
    cell: ({ genres }) => (
      <div className="w-40 flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="text-xs font-semibold text-gray-500 underline italic">
            {genre.name}
            {index === genres.length - 1 ? '' : ', '}
          </Link>
        ))}
      </div>
    ),
  },
  {
    name: 'Agregada por',
    accessor: (row: any) => row,
    cell: ({ users }) => (
      <div className="w-40">
        <Link
          href={`/users/${users.id}`}
          className="whitespace-nowrap text-sm font-semibold text-gray-500 underline underline-offset-1"
          target="_blank">
          {users.name}
        </Link>
      </div>
    ),
  },
  {
    name: 'Agregada el',
    accessor: (row: any) => row,
    cell: ({ createdAt }) => (
      <div className="w-40">
        {dayjs(createdAt).format('DD/MM/YYYY HH:mm a')}
      </div>
    ),
  },
];
