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
        <div className="flex flex-row gap-2 w-96">
          <div className="w-4/12 h-46">
            <Link
              href={`/dashboard/events/${event.slug}`}
              className="relative flex h-[130px] w-full">
              <Image
                unoptimized
                className="rounded-lg object-scale-down"
                src={`https://coanime.net/images/events/${event.image}`}
                alt={event.name}
                loading="lazy"
                fill
              />
            </Link>
          </div>
          <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
            <Link
              href={`/dashboard/events/${event.slug}`}
              className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <h4 className="text-sm">{event.name}</h4>
            </Link>
            <p className="text-gray-600 text-xs">
              {strLimit(extractText(event.description ?? '') || '', 150)}
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
    header: 'Ciudad/Pais',
    cell: ({ row }) => {
      const event = row.original;
      const name = JSON.parse(event.country?.translations || '{}');
      return (
        <div className="w-40 flex flex-col gap-2 text-sm">
          <span>{event.address}</span>
          <span>{`${event.country?.emoji} ${event.city?.name}, ${name['es'] || ''}`}</span>
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
          Inicio/Termino
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="w-40 flex">
          {`${dayjs(event.dateStart).format('DD/MM/YYYY HH:mm a')} al ${dayjs(
            event.dateEnd
          ).format('DD/MM/YYYY HH:mm a')}`}
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
      return (
        <div className="w-40 flex">
          {event.createdAt
            ? dayjs(event.createdAt).format('DD/MM/YYYY HH:mm a')
            : dayjs(event.updatedAt).format('DD/MM/YYYY HH:mm a')}
        </div>
      );
    },
    enableSorting: true,
  },
];
