'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { extractText, strLimit } from '@/utils/string';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Person = {
  id: string;
  name: string;
  slug: string;
  japaneseName: string;
  about: string;
  image: string;
  areasSkillsHobbies: string;
  country: {
    emoji: string;
    translations: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export const createPeopleColumns = (): ColumnDef<Person>[] => [
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
      const person = row.original;
      return (
        <div className="flex flex-row gap-4 w-96 py-2">
          <div className="w-24 h-24 shrink-0 relative rounded-lg overflow-hidden shadow-md">
            <Link href={`/dashboard/people/${person.slug}`}>
              <Image
                className="object-cover"
                src={`https://api.coanime.net/storage/images/encyclopedia/people/${person.image}`}
                alt={person.name}
                loading="lazy"
                fill
                unoptimized
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/people/${person.slug}`}
              className="text-orange-600 font-semibold text-sm hover:text-orange-700 hover:underline transition-colors line-clamp-1 block mb-0.5">
              {person.name}
            </Link>
            {person.japaneseName ? (
              <p className="text-gray-500 text-xs mb-1">{person.japaneseName}</p>
            ) : null}
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {strLimit(extractText(person.about ?? '') || '', 100)}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'areasSkillsHobbies',
    header: 'Áreas / Hobbies',
    cell: ({ row }) => {
      const text = row.original.areasSkillsHobbies;
      if (!text) return <div className="w-60">—</div>;
      return (
        <div className="w-60">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 rounded-md shadow-sm line-clamp-2">
            {text}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'country',
    header: 'País',
    cell: ({ row }) => {
      const country = row.original.country;
      if (!country) return <div className="w-40">—</div>;
      const name = JSON.parse(country.translations || '{}');
      const label = `${country.emoji || ''} ${name['es'] || ''}`.trim();
      return (
        <div className="w-40">
          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
            {label || '—'}
          </span>
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
      const person = row.original;
      const d = person.createdAt || person.updatedAt;
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
