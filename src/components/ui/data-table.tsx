'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  // Server-side pagination
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    lastPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Buscar...',
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const isServerSidePagination = Boolean(pagination);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSidePagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: isServerSidePagination
      ? undefined
      : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    manualPagination: isServerSidePagination,
    manualFiltering: isServerSidePagination,
    pageCount: pagination?.lastPage ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }
        : undefined,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Toolbar con búsqueda y visibilidad de columnas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1 w-full sm:w-auto">
          {searchKey ? (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm w-full shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm w-full shadow-sm focus:ring-2 focus:ring-orange-500"
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto shadow-sm hover:bg-gray-50">
              Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer hover:bg-orange-50"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="group">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-gray-500 text-sm font-medium">
                        No hay resultados.
                      </p>
                      <p className="text-gray-400 text-xs">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 font-medium">
          {isServerSidePagination ? (
            <>
              Mostrando{' '}
              <span className="text-gray-900 font-semibold">
                {pagination?.total ?? 0}
              </span>{' '}
              resultado(s) en total
            </>
          ) : (
            <>
              Mostrando{' '}
              <span className="text-gray-900 font-semibold">
                {table.getFilteredRowModel().rows.length}
              </span>{' '}
              resultado(s) en total
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSidePagination && pagination) {
                const newPage = pagination.currentPage - 1;
                if (newPage >= 1) {
                  pagination.onPageChange(newPage);
                }
              } else {
                table.previousPage();
              }
            }}
            disabled={
              isServerSidePagination
                ? pagination?.currentPage === 1
                : !table.getCanPreviousPage()
            }
            className="shadow-sm hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
          </Button>
          <div className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md shadow-sm">
            Página{' '}
            {isServerSidePagination
              ? `${pagination?.currentPage ?? 1} de ${pagination?.lastPage ?? 1}`
              : `${table.getState().pagination.pageIndex + 1} de ${table.getPageCount() || 1}`}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSidePagination && pagination) {
                const newPage = pagination.currentPage + 1;
                if (newPage <= pagination.lastPage) {
                  pagination.onPageChange(newPage);
                }
              } else {
                table.nextPage();
              }
            }}
            disabled={
              isServerSidePagination
                ? pagination?.currentPage === pagination?.lastPage
                : !table.getCanNextPage()
            }
            className="shadow-sm hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
