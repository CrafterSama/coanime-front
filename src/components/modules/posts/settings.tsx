import Image from 'next/future/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { strLimit, extractText } from '@/utils/string';

export const headers = [
  {
    name: 'Imagen y Titulo',
    accessor: (row: any) => row,
    cell: row => (
      <div className="w-96 flex flex-col gap-2">
        <Link href={`/posts/${row.slug}`}>
          <a className="whitespace-pre-wrap flex fex-row gap-4 text-sm">
            <div className="w-3/12">
              <Image
                className="rounded-lg"
                src={row.image}
                alt={row.title}
                loading="lazy"
                width="100%"
                height="100%"
              />
            </div>
            <div className="w-9/12 text-orange-500 underline underline-offset-2 font-semibold">
              {row.title}
            </div>
          </a>
        </Link>
        <p className="text-gray-600 text-xs">
          {strLimit(extractText(row?.content), 150)}
        </p>
      </div>
    ),
    firstItem: true,
    fixed: true,
  },
  {
    name: 'Visible en',
    accessor: (row: any) => row,
    cell: row => (
      <div className="w-40">
        <span className="text-sm text-gray-700 mr-2">
          {dayjs(row.postponed_to).format('DD/MM/YYYY HH:mm a')}
        </span>
      </div>
    ),
  },
  {
    name: 'Categoria',
    accessor: (row: any) => row,
    cell: ({ categories }) => (
      <div className="w-40">
        <Link href={`/categories/${categories.id}`}>
          <a className="text-sm font-semibold text-gray-500 underline underline-offset-1">
            {categories.name}
          </a>
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
          <Link key={tag.id} href={`/tags/${tag.id}`}>
            <a className="text-xs font-semibold text-gray-500 underline italic">
              {tag.name}
              {index === tags.length - 1 ? '' : ', '}
            </a>
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
        <Link href={`/users/${users.id}`}>
          <a
            className="whitespace-nowrap text-sm font-semibold text-gray-500 underline underline-offset-1"
            target="_blank">
            {users.name}
          </a>
        </Link>
      </div>
    ),
  },
];
