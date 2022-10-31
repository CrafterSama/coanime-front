import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';

export const headers = [
  {
    name: 'Imagen y Nombre',
    accessor: (row: any) => row,
    cell: (row) => (
      <div className="flex flex-row gap-2 w-96">
        <div className="w-4/12 h-46">
          <Link href={`/dashboard/events/${row?.slug}`}>
            <Image
              className="rounded-lg w-full h-full"
              src={`https://coanime.net/images/events/${row?.image}`}
              alt={row?.name}
              loading="lazy"
              fill
            />
          </Link>
        </div>
        <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
          <Link
            href={`/dashboard/events/${row?.slug}`}
            className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
            <h4 className="text-sm">{row?.name}</h4>
          </Link>
          <p className="text-gray-600 text-xs">
            {strLimit(extractText(row?.description), 150)}
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
    cell: ({ country, city, address }) => {
      const name = JSON.parse(country.translations);
      return (
        <div className="w-40 flex flex-col gap-2 text-sm">
          <span>{address}</span>
          <span>{`${country?.emoji} ${city?.name}, ${name['es']}`}</span>
        </div>
      );
    },
  },
  {
    name: 'Inicio/Termino',
    accessor: (row: any) => row,
    cell: ({ dateStart, dateEnd }) => (
      <div className="w-40 flex">
        {`${dayjs(dateStart).format('DD/MM/YYYY HH:mm a')} al ${dayjs(
          dateEnd
        ).format('DD/MM/YYYY HH:mm a')}`}
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
