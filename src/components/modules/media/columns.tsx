'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { PencilIcon, LinkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_IMAGE } from '@/constants/common';
import { MediaItem } from '@/hooks/media';
import { strLimit } from '@/utils/string';

export const createMediaColumns = (
  setMediaId: (id: number) => void,
  setOpenEditModal: (open: boolean) => void
): ColumnDef<MediaItem>[] => [
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
      const media = row.original;
      const imageUrl = media.thumbUrl || media.url || DEFAULT_IMAGE;
      
      return (
        <div className="flex flex-row gap-4 w-96 py-2">
          <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
            <Image
              className="object-cover"
              src={imageUrl}
              alt={media.name}
              loading="lazy"
              fill
              unoptimized
            />
            {media.isPlaceholder && (
              <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-yellow-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-start gap-2 mb-1">
              <span className="text-gray-900 font-semibold text-sm line-clamp-2 flex-1">
                {media.name}
              </span>
              <button
                onClick={() => {
                  setMediaId(media.id);
                  setOpenEditModal(true);
                }}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Editar media">
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 text-xs line-clamp-1">
              {media.fileName}
            </p>
            {media.isPlaceholder && (
              <Badge variant="outline" className="mt-1 text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                Placeholder
              </Badge>
            )}
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'modelType',
    header: 'Modelo',
    cell: ({ row }) => {
      const media = row.original;
      if (!media.modelType || !media.modelId) {
        return <span className="text-gray-400 text-sm">N/A</span>;
      }

      const modelRoutes: Record<string, string> = {
        Post: '/dashboard/posts',
        Title: '/dashboard/titles',
        User: '/dashboard/users',
        Magazine: '/dashboard/magazine',
      };

      const route = modelRoutes[media.modelType];
      const href = route && media.modelId ? `${route}/${media.modelId}` : '#';

      return (
        <div className="w-32">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="text-xs w-fit">
              {media.modelType}
            </Badge>
            {media.modelTitle && (
              <Link
                href={href}
                className="text-xs text-orange-600 hover:text-orange-700 hover:underline transition-colors line-clamp-1">
                {strLimit(media.modelTitle, 30)}
              </Link>
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'collectionName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Colección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const collection = row.original.collectionName;
      if (!collection) {
        return (
          <div className="w-32">
            <span className="text-gray-400 text-sm">-</span>
          </div>
        );
      }
      return (
        <div className="w-32">
          <Badge variant="secondary" className="text-xs">
            {collection}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'size',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tamaño
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.original.size;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      return (
        <div className="w-24 text-sm text-gray-600">
          {size > 0 ? `${sizeInMB} MB` : 'N/A'}
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
          Creado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="w-32 text-sm text-gray-600">
          {date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const media = row.original;
      return (
        <div className="flex items-center gap-2">
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Ver imagen">
            <LinkIcon className="h-4 w-4" />
          </a>
          <button
            onClick={() => {
              setMediaId(media.id);
              setOpenEditModal(true);
            }}
            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Editar">
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      );
    },
    enableSorting: false,
  },
];
