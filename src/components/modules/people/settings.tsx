import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';

export const headers = [
  {
    name: 'Imagen y Nombre',
    accessor: (row: any) => row,
    cell: (row: any) => (
      <div className="flex flex-row gap-2 w-96">
        <div className="w-4/12 h-46">
          <Link
            href={`/dashboard/people/${row?.slug}`}
            className="relative flex h-[170px] w-full">
            <Image
              className="rounded-lg object-scale-down bg-gray-200"
              src={`https://api.coanime.net/storage/images/encyclopedia/people/${row?.image}`}
              alt={row?.name}
              loading="lazy"
              fill
              unoptimized
            />
          </Link>
        </div>
        <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
          <Link
            href={`/dashboard/people/${row?.slug}`}
            className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
            <h4 className="text-sm">{row?.name}</h4>
          </Link>
          <p className="text-gray-500 text-xs">{row?.japaneseName}</p>
          <p className="text-gray-600 text-xs">
            {strLimit(extractText(row?.about ?? '') || '', 150)}
          </p>
        </div>
      </div>
    ),
    firstItem: true,
    fixed: true,
    headerClassName: 'w-72',
  },
  {
    name: 'Areas que trabaja/Hobbies',
    accessor: (row: any) => row,
    cell: ({ areasSkillsHobbies }: { areasSkillsHobbies: string }) => (
      <div className="w-60 flex justify-center items-center text-sm">
        {areasSkillsHobbies}
      </div>
    ),
  },
  {
    name: 'Ciudad/Pais',
    accessor: (row: any) => row,
    cell: (row: any) => {
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
    cell: ({
      createdAt,
      updatedAt,
    }: {
      createdAt?: string;
      updatedAt?: string;
    }) => (
      <div className="w-40 flex">
        {createdAt
          ? dayjs(createdAt).format('DD/MM/YYYY HH:mm a')
          : dayjs(updatedAt).format('DD/MM/YYYY HH:mm a')}
      </div>
    ),
  },
];
