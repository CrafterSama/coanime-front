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
        <div className="flex flex-row gap-2 w-96">
          <div className="w-4/12 h-46">
            <Link
              href={`/dashboard/people/${person.slug}`}
              className="relative flex h-[170px] w-full">
              <Image
                className="rounded-lg object-scale-down bg-gray-200"
                src={`https://api.coanime.net/storage/images/encyclopedia/people/${person.image}`}
                alt={person.name}
                loading="lazy"
                fill
                unoptimized
              />
            </Link>
          </div>
          <div className="w-9/12 text-orange-500 font-semibold flex flex-col gap-2">
            <Link
              href={`/dashboard/people/${person.slug}`}
              className="whitespace-pre-wrap flex fex-row gap-4 text-sm underline underline-offset-3">
              <h4 className="text-sm">{person.name}</h4>
            </Link>
            <p className="text-gray-500 text-xs">{person.japaneseName}</p>
            <p className="text-gray-600 text-xs">
              {strLimit(extractText(person.about ?? '') || '', 150)}
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
    header: 'Areas que trabaja/Hobbies',
    cell: ({ row }) => {
      return (
        <div className="w-60 flex justify-center items-center text-sm">
          {row.original.areasSkillsHobbies}
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
      const person = row.original;
      return (
        <div className="w-40 flex">
          {person.createdAt
            ? dayjs(person.createdAt).format('DD/MM/YYYY HH:mm a')
            : dayjs(person.updatedAt).format('DD/MM/YYYY HH:mm a')}
        </div>
      );
    },
    enableSorting: true,
  },
];
