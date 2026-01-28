'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Event = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  address: string;
  country: {
    emoji: string;
    translations: string;
  };
  city: {
    name: string;
  };
  dateStart: string;
  dateEnd: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createEventColumns = (): ColumnDef<Event>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Imagen y Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex flex-row gap-4 w-96 py-2">
          <div className="w-24 h-24 shrink-0 relative rounded-lg overflow-hidden shadow-md bg-gray-100">
            <Link href={`/dashboard/events/${event.slug}`}>
              <Image
                className="object-cover"
                src={`https://coanime.net/images/events/${event.image}`}
                alt={event.name}
                loading="lazy"
                fill
                unoptimized
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/events/${event.slug}`}
              className="text-orange-600 font-semibold text-sm hover:text-orange-700 hover:underline transition-colors line-clamp-1 block mb-1">
              {event.name}
            </Link>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {strLimit(extractText(event.description ?? '') || '', 100)}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'country',
    header: 'Ubicación',
    cell: ({ row }) => {
      const event = row.original;
      if (!event.country && !event.address) return <div className="w-40">—</div>;
      const name = JSON.parse(event.country?.translations || '{}');
      const location = [
        event.address,
        [event.country?.emoji, event.city?.name, name['es']].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join(' · ');
      return (
        <div className="w-40">
          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors line-clamp-2">
            {location || '—'}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'dateStart',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Inicio / Fin
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="w-40 flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded shadow-sm w-fit">
            {dayjs(event.dateStart).format('DD/MM/YYYY')}
          </span>
          <span className="text-xs text-gray-500">
            {dayjs(event.dateStart).format('HH:mm')} – {dayjs(event.dateEnd).format('HH:mm')}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Agregado el
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      const d = event.createdAt || event.updatedAt;
      if (!d) return <div className="w-40">—</div>;
      return (
        <div className="w-40 flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded shadow-sm w-fit">
            {dayjs(d).format('DD/MM/YYYY')}
          </span>
          <span className="text-xs text-gray-500">{dayjs(d).format('HH:mm')}</span>
        </div>
      );
    },
    enableSorting: true,
  },
];
