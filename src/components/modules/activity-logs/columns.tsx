'use client';

import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { EyeIcon } from '@heroicons/react/24/outline';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type ActivityLogRow = {
  id: number;
  description: string | null;
  subjectType: string | null;
  subjectId: number | string | null;
  causerType: string | null;
  causerId: number | null;
  causer?: { id: number; name: string; email?: string } | null;
  properties?: {
    controllerName?: string;
    method?: string;
    statusCode?: number;
    httpMethod?: string;
    url?: string;
    path?: string;
    ipAddress?: string;
    userAgent?: string;
    [key: string]: unknown;
  } | null;
  createdAt: string;
};

function statusBadgeVariant(
  code: number | undefined
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (code == null) return 'secondary';
  if (code >= 500) return 'destructive';
  if (code >= 400) return 'outline';
  return 'default';
}

function statusBadgeClass(code: number | undefined): string {
  if (code == null) return 'bg-gray-100 text-gray-700';
  if (code >= 500) return 'bg-red-100 text-red-800';
  if (code >= 400) return 'bg-amber-100 text-amber-800';
  return 'bg-green-100 text-green-800';
}

export function createActivityLogColumns(
  onView: (log: ActivityLogRow) => void
): ColumnDef<ActivityLogRow>[] {
  return [
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Descripción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div className="max-w-md py-2">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {log.description ?? '—'}
            </p>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'causer',
      header: 'Usuario',
      cell: ({ row }) => {
        const log = row.original;
        const name =
          log.causer?.name ?? (log.causerId ? `#${log.causerId}` : '—');
        return (
          <span className="inline-flex px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg shadow-sm">
            {name}
          </span>
        );
      },
    },
    {
      id: 'controller',
      header: 'Controlador',
      cell: ({ row }) => {
        const c = row.original.properties?.controllerName ?? '—';
        return (
          <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
            {c}
          </span>
        );
      },
    },
    {
      id: 'method',
      header: 'Método',
      cell: ({ row }) => {
        const m = row.original.properties?.method ?? '—';
        return (
          <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">
            {m}
          </span>
        );
      },
    },
    {
      id: 'statusCode',
      header: 'HTTP',
      cell: ({ row }) => {
        const code = row.original.properties?.statusCode;
        return (
          <Badge
            variant={statusBadgeVariant(code)}
            className={statusBadgeClass(code)}>
            {code ?? '—'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      id: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded shadow-sm">
              {dayjs(log.createdAt).format('DD/MM/YYYY')}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(log.createdAt).format('HH:mm:ss')}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
          onClick={() => onView(row.original)}>
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">Ver detalle</span>
        </Button>
      ),
    },
  ];
}
