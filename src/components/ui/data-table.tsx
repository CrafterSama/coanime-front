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
  DataTablePaginationSkeleton,
  DataTableRowsSkeleton,
} from '@/components/ui/data-table-skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  // Loading state
  isLoading?: boolean;
  // Server-side pagination
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    lastPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  // Server-side sorting
  onSortingChange?: (sorting: SortingState) => void;
  // Server-side filtering
  onSearchChange?: (search: string) => void;
  initialSorting?: SortingState;
  initialSearch?: string;
  // Custom filters
  filters?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Buscar...',
  isLoading = false,
  pagination,
  onSortingChange,
  onSearchChange,
  initialSorting = [],
  initialSearch = '',
  filters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);
  // Estado local para el input de búsqueda (solo se actualiza cuando se presiona Enter)
  const [searchInputValue, setSearchInputValue] = React.useState(initialSearch);

  const isServerSidePagination = Boolean(pagination);
  const isServerSideSorting = Boolean(onSortingChange);
  const isServerSideFiltering = Boolean(onSearchChange);

  // Handle sorting changes for server-side
  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    if (onSortingChange) {
      onSortingChange(newSorting);
    }
  };

  // Handle search input changes (solo actualiza el estado local)
  const handleSearchInputChange = (value: string) => {
    setSearchInputValue(value);
    setGlobalFilter(value);
  };

  // Handle search on Enter key (dispara la búsqueda real)
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && onSearchChange) {
      onSearchChange(searchInputValue);
    }
  };

  // Handle search changes for server-side (mantener para compatibilidad con onGlobalFilterChange)
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    // No llamamos a onSearchChange aquí porque queremos que solo se ejecute al presionar Enter o limpiar
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInputValue('');
    setGlobalFilter('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // Sincronizar searchInputValue cuando cambia initialSearch (desde props)
  React.useEffect(() => {
    setSearchInputValue(initialSearch);
    setGlobalFilter(initialSearch);
  }, [initialSearch]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSidePagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: isServerSideSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel:
      isServerSidePagination || isServerSideFiltering
        ? undefined
        : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: handleSearchChange,
    globalFilterFn: 'includesString',
    manualPagination: isServerSidePagination,
    manualFiltering: isServerSidePagination || isServerSideFiltering,
    manualSorting: isServerSideSorting,
    pageCount:
      pagination?.lastPage && pagination.lastPage > 0 ? pagination.lastPage : 1,
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
        : {
            pageIndex: 0,
            pageSize: 10,
          },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Toolbar con búsqueda, filtros y visibilidad de columnas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="flex-1 w-full sm:w-auto flex items-center gap-4">
          {searchKey ? (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-orange-500 rounded-md"
            />
          ) : (
            <div className="relative max-w-sm w-full">
              <Input
                placeholder={searchPlaceholder}
                value={searchInputValue ?? ''}
                onChange={(event) =>
                  handleSearchInputChange(String(event.target.value))
                }
                onKeyDown={handleSearchKeyDown}
                className="w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-orange-500 pr-10 rounded-md"
              />
              {searchInputValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Limpiar búsqueda">
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          )}
          {/* Filtros personalizados */}
          {filters && <div className="flex items-center gap-2">{filters}</div>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-gray-50 rounded-md">
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
      <div className="rounded-md bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        <div className="max-h-141 overflow-auto">
          <div className="relative">
            <table className="w-full caption-bottom text-sm">
              <thead className="sticky top-0 z-20 bg-gray-50 [&_tr]:shadow-sm [&_tr]:border-b [&_tr]:border-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-gray-50 [&:has([role=checkbox])]:pr-0">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-gray-100">
                {isLoading ? (
                  <DataTableRowsSkeleton rows={10} columns={columns.length} />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="transition-colors hover:bg-orange-50/50 data-[state=selected]:bg-orange-50 shadow-sm group">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="transition-colors hover:bg-orange-50/50 shadow-sm">
                    <td
                      colSpan={columns.length}
                      className="h-32 text-center p-4 align-middle">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-sm font-medium">
                          No hay resultados.
                        </p>
                        <p className="text-gray-400 text-xs">
                          Intenta ajustar los filtros de búsqueda
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {isLoading ? (
        <DataTablePaginationSkeleton />
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border-t border-gray-100">
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
                  : !table.getCanPreviousPage() ||
                    table.getState().pagination.pageIndex === 0
              }
              className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md">
              Anterior
            </Button>
            <div className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              Página{' '}
              {isServerSidePagination
                ? `${pagination?.currentPage ?? 1} de ${
                    pagination?.lastPage && pagination.lastPage > 0
                      ? pagination.lastPage
                      : 1
                  }`
                : `${(table.getState().pagination?.pageIndex ?? 0) + 1} de ${
                    table.getPageCount() || 1
                  }`}
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
              className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md">
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
