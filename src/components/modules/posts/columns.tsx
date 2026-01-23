'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { EyeIcon, LinkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Show } from '@/components/ui/Show';
import { DEFAULT_IMAGE } from '@/constants/common';
import { UserWithRoles } from '@/types/auth/user-with-roles.types';
import { hasRole } from '@/utils/common';
import { extractText, strLimit } from '@/utils/string';

export type Post = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  content: string;
  postponedTo: string;
  viewCounter: number;
  categories: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  users: {
    id: string;
    name: string;
  };
};

export const createPostColumns = (
  authUser: UserWithRoles | null | undefined,
  setPostId: (id: string) => void,
  setOpenDeleteModal: (open: boolean) => void
): ColumnDef<Post>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Imagen y Titulo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex flex-row gap-4 w-96 py-2">
          <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
            <Image
              className="object-cover"
              src={post.image ?? DEFAULT_IMAGE}
              alt={post.title}
              loading="lazy"
              fill
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-start gap-2 mb-1">
              <Link
                href={`/dashboard/posts/${post.slug}`}
                className="text-orange-600 font-semibold text-sm hover:text-orange-700 hover:underline transition-colors line-clamp-2 flex-1">
                {post.title}
              </Link>
              <Link
                href={`/posts/${post.slug}`}
                target="_blank"
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Ver en sitio público">
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {strLimit(extractText(post.content ?? '') || '', 100)}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'postponedTo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Visible el
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="w-40">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded shadow-sm">
              {dayjs(post.postponedTo).format('DD/MM/YYYY')}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(post.postponedTo).format('hh:mm a')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
              <EyeIcon className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{post.viewCounter}</span>
              <span className="text-gray-400">vistas</span>
            </div>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'categories',
    header: 'Categoria',
    cell: ({ row }) => {
      const category = row.original.categories;
      return (
        <div className="w-40">
          <Link
            href={`/categories/${category.id}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-full hover:bg-teal-100 shadow-sm hover:shadow-md transition-all">
            {category.name}
          </Link>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags;
      return (
        <div className="w-40 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 shadow-sm hover:shadow-md transition-all">
              {tag.name}
            </Link>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-md shadow-sm">
              +{tags.length - 3}
            </span>
          )}
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
          Autor
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
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="w-40">
          <Show
            condition={
              hasRole(authUser?.roles, 'administrator') ||
              hasRole(authUser?.roles, 'writer')
            }>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-row gap-2 items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm hover:shadow-md transition-all"
              onClick={() => {
                setPostId(post.id);
                setOpenDeleteModal(true);
              }}>
              <TrashIcon className="w-4 h-4" />
              <span>Borrar</span>
            </Button>
          </Show>
        </div>
      );
    },
    enableHiding: false,
  },
];
