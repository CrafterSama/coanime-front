import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';
import { extractText, strLimit } from '@/utils/string';
import { EyeIcon, LinkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { hasRole } from '@/utils/common';
import { Show } from '@/components/ui/Show';
import { Button } from '@/components/ui/button';

export const usePostsSettings = ({
  user: authUser,
  setPostId,
  setOpenDeleteModal,
}) => {
  const headers = [
    {
      name: 'Imagen y Titulo',
      accessor: (row: any) => row,
      cell: (row) => (
        <div className="flex flex-row gap-2 w-96 py-1">
          <div className="w-1/2 flex items-center relative">
            <Image
              className="rounded-lg w-full h-3/4 min-h-[90px] object-cover"
              src={row.image ?? DEFAULT_IMAGE}
              alt={row.title}
              loading="lazy"
              fill
              unoptimized
            />
          </div>
          <div className="w-7/12 text-orange-500 font-semibold">
            <div className="flex flex-row gap-2">
              <Link
                href={`/dashboard/posts/${row.slug}`}
                className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-2">
                {row.title}
              </Link>
              <Link
                href={`/posts/${row?.slug}`}
                className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-gray-600 text-xs">
              {strLimit(extractText(row?.content), 100)}
            </p>
          </div>
        </div>
      ),
      firstItem: true,
      fixed: true,
      headerClassName: 'w-72',
    },
    {
      name: 'Visible el',
      accessor: (row: any) => row,
      cell: (row) => (
        <div className="w-40">
          <div className="flex flex-col justify-center items-center">
            <span className="text-sm text-gray-700 mr-2">
              {dayjs(row.postponedTo).format('DD/MM/YYYY hh:mm a')}
            </span>
            <span className="text-sm text-gray-700 flex gap-2 justify-center items-center">
              <EyeIcon className="h-6 w-6 text-gray-400" />
              {row.viewCounter} Vistas
            </span>
          </div>
        </div>
      ),
    },
    {
      name: 'Categoria',
      accessor: (row: any) => row,
      cell: ({ categories }) => (
        <div className="w-40">
          <Link
            href={`/categories/${categories.id}`}
            className="text-sm font-semibold text-gray-500 underline underline-offset-1">
            {categories.name}
          </Link>
        </div>
      ),
    },
    {
      name: 'Tags',
      accessor: (row: any) => row,
      cell: ({ tags }) => (
        <div className="w-40 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="text-xs font-semibold text-gray-500 underline italic">
              {tag.name}
              {index === tags.length - 1 ? '' : ', '}
            </Link>
          ))}
        </div>
      ),
    },
    {
      name: 'Autor',
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
      name: 'Acciones',
      accessor: (row: any) => row,
      cell: (row) => (
        <div className="w-40">
          <div className="flex flex-row gap-2">
            <Show
              condition={
                hasRole(authUser?.roles, 'administrator') ||
                hasRole(authUser?.roles, 'writer')
              }>
              <Button
                prefix={<TrashIcon className="w-4 h-4" />}
                color="red"
                className="flex flex-row gap-2 items-center justify-center"
                onClick={() => {
                  setPostId(row?.id);
                  setOpenDeleteModal(true);
                }}>
                <span>Borrar</span>
              </Button>
            </Show>
          </div>
        </div>
      ),
    },
  ];

  return { headers };
};
