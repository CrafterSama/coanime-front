'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Magazine = {
  id: string;
  name: string;
  slug: string;
  about: string;
  image: {
    name: string;
  } | null;
  type: {
    name: string;
  };
  release: {
    name: string;
  };
  country: {
    emoji: string;
    translations: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export const createMagazineColumns = (): ColumnDef<Magazine>[] => [
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
      const magazine = row.original;
      return (
        <div className="flex flex-row gap-2 w-96">
          <div className="w-4/12 h-46">
            <Link
              href={`/dashboard/magazine/${magazine.slug}`}
              className="relative flex h-[170px] w-full">
              <Image
                className="rounded-lg object-scale-down bg-gray-200"
                src={`https://api.coanime.net/storage/images/encyclopedia/magazine/${magazine.image?.name}`}
                alt={magazine.name}
                loading="lazy"
                fill
                unoptimized
              />
            </Link>
          </div>
          <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
            <Link
              href={`/dashboard/magazine/${magazine.slug}`}
              className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <h4 className="text-sm">{magazine.name}</h4>
            </Link>
            <p className="text-gray-600 text-xs">
              {strLimit(extractText(magazine.about ?? '') || '', 150)}
            </p>
            <p className="text-gray-600 text-xs">
              Demografia : {magazine.type?.name}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'release',
    header: 'Tiempo de Publicación',
    cell: ({ row }) => {
      return (
        <div className="w-60 flex justify-center items-center text-sm">
          {row.original.release?.name}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'country',
    header: 'Ciudad/Pais',
    cell: ({ row }) => {
      const country = row.original.country;
      const name = JSON.parse(country?.translations || '{}');
      return (
        <div className="w-40 flex flex-row gap-2 text-sm">
          <span>{`${country?.emoji} ${name['es'] || ''}`}</span>
        </div>
      );
    },
    enableSorting: false,
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
      const magazine = row.original;
      return (
        <div className="w-40 flex">
          {magazine.createdAt
            ? dayjs(magazine.createdAt).format('DD/MM/YYYY HH:mm a')
            : dayjs(magazine.updatedAt).format('DD/MM/YYYY HH:mm a')}
        </div>
      );
    },
    enableSorting: true,
  },
];
