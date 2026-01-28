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
        <div className="flex flex-row gap-4 w-96 py-2">
          <div className="w-24 h-24 shrink-0 relative rounded-lg overflow-hidden shadow-md">
            <Link href={`/dashboard/titles/${title.id}`}>
              <Image
                className="object-cover"
                src={title.images?.name ?? DEFAULT_IMAGE}
                alt={title.name}
                loading="lazy"
                fill
                unoptimized
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-start gap-2 mb-1">
              <Link
                href={`/dashboard/titles/${title.id}`}
                className="text-orange-600 font-semibold text-sm hover:text-orange-700 hover:underline transition-colors line-clamp-2 flex-1">
                {title.name}
              </Link>
              <Link
                href={`/ecma/titulos/${title.type.slug}/${title.slug}`}
                target="_blank"
                className="shrink-0 p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Ver en sitio público">
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-0.5">
              {strLimit(extractText(title.sinopsis ?? '') || '', 100)}
            </p>
            {title.otherTitles ? (
              <p className="text-gray-500 text-xs truncate" title={title.otherTitles}>
                Otros títulos: {strLimit(title.otherTitles, 40)}
              </p>
            ) : null}
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.original.type;
      if (!type?.name) return <div className="w-40">—</div>;
      return (
        <div className="w-40">
          <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-full shadow-sm hover:bg-teal-100 transition-colors">
            {type.name}
          </span>
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
      if (!rating?.name) return <div className="w-40">—</div>;
      return (
        <div className="w-40 flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded shadow-sm w-fit">
            {rating.name}
          </span>
          {rating.description ? (
            <span className="text-xs text-gray-500 line-clamp-1">{rating.description}</span>
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'genres',
    header: 'Géneros',
    cell: ({ row }) => {
      const genres = row.original.genres;
      if (!genres?.length) return <div className="w-40">—</div>;
      return (
        <div className="w-40 flex flex-wrap gap-1.5">
          {genres.slice(0, 3).map((genre) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}`}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 shadow-sm hover:shadow-md transition-all">
              {genre.name}
            </Link>
          ))}
          {genres.length > 3 ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-md shadow-sm">
              +{genres.length - 3}
            </span>
          ) : null}
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
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm hover:shadow-md transition-all"
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
      const d = row.original.createdAt;
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
