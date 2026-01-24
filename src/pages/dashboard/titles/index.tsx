import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SortingState } from '@tanstack/react-table';

import AppLayout from '@/components/Layouts/AppLayout';
import { createTitleColumns } from '@/components/modules/titles/columns';
import { DataTable } from '@/components/ui/data-table';
import { FilterSelect } from '@/components/ui/filter-select';
import Loading from '@/components/ui/Loading';
import { useTitles } from '@/hooks/titles';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

const Titles = () => {
  const router = useRouter();

  // Inicializar page desde URL o default 1
  const initialPage = router?.query?.page ? Number(router.query.page) : 1;

  const [page, setPage] = useState<number>(initialPage);
  const [name, setName] = useState<string>(
    (router?.query?.name as string) || ''
  );
  const [sortBy, setSortBy] = useState<string>(
    (router?.query?.sortBy as string) || 'created_at'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    (router?.query?.sortDirection as 'asc' | 'desc') || 'desc'
  );
  const [typeId, setTypeId] = useState<string | number | undefined>(
    (router?.query?.typeId as string) || undefined
  );
  const [ratingId, setRatingId] = useState<string | number | undefined>(
    (router?.query?.ratingId as string) || undefined
  );
  const [genreId, setGenreId] = useState<string | number | undefined>(
    (router?.query?.genreId as string) || undefined
  );

  // React Query: cache automático por queryKey ['titles', page, name, sortBy, sortDirection, ...]
  const { data = {}, isLoading } = useTitles({
    page,
    name,
    sortBy,
    sortDirection,
    typeId: typeId ? Number(typeId) : undefined,
    ratingId: ratingId ? Number(ratingId) : undefined,
    genreId: genreId ? Number(genreId) : undefined,
  });
  const { result, title, description, filters } = data;
  const columns = React.useMemo(() => createTitleColumns(), []);

  // Helper para actualizar URL con todos los filtros
  const updateURL = React.useCallback(
    (updates: Record<string, any>) => {
      const query: Record<string, any> = {
        page: updates.page ?? page,
        ...(updates.name !== undefined
          ? updates.name
            ? { name: updates.name }
            : {}
          : name
          ? { name }
          : {}),
        ...(updates.sortBy !== undefined
          ? updates.sortBy
            ? { sortBy: updates.sortBy }
            : {}
          : sortBy
          ? { sortBy }
          : {}),
        ...(updates.sortDirection !== undefined
          ? updates.sortDirection
            ? { sortDirection: updates.sortDirection }
            : {}
          : sortDirection
          ? { sortDirection }
          : {}),
        ...(updates.typeId !== undefined
          ? updates.typeId
            ? { typeId: updates.typeId }
            : {}
          : typeId
          ? { typeId }
          : {}),
        ...(updates.ratingId !== undefined
          ? updates.ratingId
            ? { ratingId: updates.ratingId }
            : {}
          : ratingId
          ? { ratingId }
          : {}),
        ...(updates.genreId !== undefined
          ? updates.genreId
            ? { genreId: updates.genreId }
            : {}
          : genreId
          ? { genreId }
          : {}),
      };
      router.push(
        {
          pathname: '/dashboard/titles',
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [page, name, sortBy, sortDirection, typeId, ratingId, genreId, router]
  );

  // 1. Sincronizar URL → Estado (cuando cambia la URL manualmente o navegación del navegador)
  useEffect(() => {
    if (router?.query?.page) {
      const urlPage = Number(router.query.page);
      if (urlPage !== page) {
        setPage(urlPage);
      }
    } else if (page !== 1) {
      setPage(1);
    }
  }, [router?.query?.page]);

  // 2. Sincronizar Backend → Estado/URL (backend es fuente de verdad)
  // Nota: httpClient transforma snake_case a camelCase, así que usamos result.currentPage
  useEffect(() => {
    if (result?.currentPage && result.currentPage !== page) {
      const backendPage = result.currentPage;
      setPage(backendPage);
      updateURL({ page: backendPage });
    }
  }, [result?.currentPage, page, updateURL]);

  // 3. Función directa: actualiza estado y URL, React Query se encarga del resto
  const onPageChange = async (newPage: number) => {
    // Validar que la página esté en rango válido
    if (result && (newPage < 1 || newPage > result.lastPage)) {
      return;
    }

    setPage(newPage);
    updateURL({ page: newPage });
  };

  // 4. Handler para búsqueda
  const handleSearchChange = (searchValue: string) => {
    setName(searchValue);
    setPage(1);
    updateURL({ name: searchValue, page: 1 });
  };

  // Handlers para filtros
  const handleTypeChange = (value: string | number | undefined) => {
    setTypeId(value);
    setPage(1);
    updateURL({ typeId: value, page: 1 });
  };

  const handleRatingChange = (value: string | number | undefined) => {
    setRatingId(value);
    setPage(1);
    updateURL({ ratingId: value, page: 1 });
  };

  const handleGenreChange = (value: string | number | undefined) => {
    setGenreId(value);
    setPage(1);
    updateURL({ genreId: value, page: 1 });
  };

  // 5. Handler para sorting
  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const newSortBy = sorting[0].id;
      const newSortDirection = sorting[0].desc ? 'desc' : 'asc';
      setSortBy(newSortBy);
      setSortDirection(newSortDirection);
      setPage(1);
      updateURL({
        sortBy: newSortBy,
        sortDirection: newSortDirection,
        page: 1,
      });
    } else {
      setSortBy('created_at');
      setSortDirection('desc');
      setPage(1);
      updateURL({ sortBy: 'created_at', sortDirection: 'desc', page: 1 });
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <AppLayout>
        <div className="p-4">
          <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-row gap-4 justify-between items-center mb-4">
              <div className="flex flex-row gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="bg-gray-200 text-orange-400 rounded p-1 hover:bg-gray-300 transition-colors">
                  <ChevronLeftIcon className="w-6 h-6" />
                </Link>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                  Lista de Titulos
                </h2>
              </div>
              <Link
                href={`/dashboard/titles/create`}
                className="font-semibold py-2 px-4 rounded-lg transition-colors text-orange-500 bg-orange-100 hover:bg-orange-200 shadow-sm hover:shadow-md flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            </div>

            <div className="bg-white overflow-auto min-h-screen shadow-sm rounded-lg p-4">
              {isLoading ? (
                <div className="flex justify-center content-center min-h-screen">
                  <Loading size={16} />
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={result?.data || []}
                  searchPlaceholder="Buscar por nombre..."
                  pagination={
                    result
                      ? {
                          // Backend es fuente de verdad: httpClient transforma snake_case a camelCase
                          pageIndex: (result.currentPage ?? 1) - 1,
                          pageSize: result.perPage ?? 15,
                          total: result.total ?? 0,
                          // Calcular lastPage si no viene del backend
                          lastPage:
                            result.lastPage ??
                            (Math.ceil(
                              (result.total ?? 0) / (result.perPage ?? 15)
                            ) ||
                              1),
                          currentPage: result.currentPage ?? 1,
                          onPageChange, // Función directa que actualiza estado y URL
                        }
                      : undefined
                  }
                  onSearchChange={handleSearchChange}
                  onSortingChange={handleSortingChange}
                  initialSearch={name}
                  initialSorting={
                    sortBy
                      ? [{ id: sortBy, desc: sortDirection === 'desc' }]
                      : []
                  }
                  filters={
                    <>
                      <FilterSelect
                        value={typeId}
                        onChange={handleTypeChange}
                        options={filters?.types || []}
                        placeholder="Todos los tipos"
                      />
                      <FilterSelect
                        value={ratingId}
                        onChange={handleRatingChange}
                        options={filters?.ratings || []}
                        placeholder="Todas las clasificaciones"
                      />
                      <FilterSelect
                        value={genreId}
                        onChange={handleGenreChange}
                        options={filters?.genres || []}
                        placeholder="Todos los géneros"
                      />
                    </>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Titles;
