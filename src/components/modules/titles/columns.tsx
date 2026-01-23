'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';
import { extractText, strLimit } from '@/utils/string';
import { LinkIcon } from '@heroicons/react/24/outline';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Title = {
  id: string;
  name: string;
  slug: string;
  sinopsis: string;
  otherTitles: string;
  images: {
    name: string;
  } | null;
  type: {
    slug: string;
    name: string;
  };
  rating: {
    name: string;
    description: string;
  };
  genres: Array<{
    id: string;
    name: string;
  }>;
  users: {
    id: string;
    name: string;
  };
  createdAt: string;
};

export const createTitleColumns = (): ColumnDef<Title>[] => [
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
      const title = row.original;
      return (
        <div className="flex flex-row gap-2 w-96">
          <div className="w-4/12 h-46">
            <Link href={`/dashboard/titles/${title.id}`}>
              <div className="relative h-[120px] w-[80%]">
                <Image
                  className="rounded-lg object-scale-down bg-gray-200"
                  src={title.images?.name ?? DEFAULT_IMAGE}
                  alt={title.name}
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
                href={`/dashboard/titles/${title.id}`}
                className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
                <h4 className="text-sm">{title.name}</h4>
              </Link>
              <Link
                href={`/ecma/titulos/${title.type.slug}/${title.slug}`}
                className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-gray-600 text-xs">
              {strLimit(extractText(title.sinopsis ?? '') || '', 150)}
            </p>
            <p className="text-gray-500 text-xs">
              Otros Titulos: {title.otherTitles}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Tipo de Titulo',
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="w-40 flex justify-center items-center text-sm">
          {type?.name}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'rating',
    header: 'Clasificación',
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="w-40 flex flex-row gap-2 text-sm">
          <span>{`${rating?.name}: ${rating?.description}`}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'genres',
    header: 'Generos',
    cell: ({ row }) => {
      const genres = row.original.genres;
      return (
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
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'users',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Agregada por
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.users;
      return (
        <div className="w-40">
          <Link
            href={`/users/${user.id}`}
            className="whitespace-nowrap text-sm font-semibold text-gray-500 underline underline-offset-1"
            target="_blank">
            {user.name}
          </Link>
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
          Agregada el
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-40">
          {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm a')}
        </div>
      );
    },
    enableSorting: true,
  },
];
