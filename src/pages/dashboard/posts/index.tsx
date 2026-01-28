import React, { useEffect, useState, useCallback } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { createPostColumns } from '@/components/modules/posts/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { FilterSelect } from '@/components/ui/filter-select';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/auth';
import { usePosts } from '@/hooks/posts';
import { postDelete } from '@/services/posts';
import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Posts = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Inicializar page desde URL o default 1
  const initialPage = router?.query?.page ? Number(router.query.page) : 1;

  const [page, setPage] = useState<number>(initialPage);
  const [name, setName] = useState<string>(
    (router?.query?.name as string) || ''
  );
  const [sortBy, setSortBy] = useState<string>(
    (router?.query?.sortBy as string) || 'postponed_to'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    (router?.query?.sortDirection as 'asc' | 'desc') || 'desc'
  );
  const [categoryId, setCategoryId] = useState<string | number | undefined>(
    (router?.query?.categoryId as string) || undefined
  );
  const [userId, setUserId] = useState<string | number | undefined>(
    (router?.query?.userId as string) || undefined
  );
  const [postId, setPostId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  // React Query: cache automático por queryKey ['posts', page, name, sortBy, sortDirection, ...]
  const {
    data = {},
    isLoading,
    refetch,
  } = usePosts({
    page,
    name,
    sortBy,
    sortDirection,
    categoryId: categoryId ? Number(categoryId) : undefined,
    userId: userId ? Number(userId) : undefined,
  });

  // El backend devuelve: { result: {...}, filters: { categories: [...], users: [...] } }
  // Similar a titles, extraemos directamente del data
  const result = data?.result || data;
  const posts = result?.data || data?.data || [];
  const filters = data?.filters || {};
  const columns = React.useMemo(
    () => createPostColumns(user, setPostId, setOpenDeleteModal),
    [user, setPostId, setOpenDeleteModal]
  );

  // Helper para actualizar URL con todos los filtros
  const updateURL = useCallback(
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
        ...(updates.categoryId !== undefined
          ? updates.categoryId
            ? { categoryId: updates.categoryId }
            : {}
          : categoryId
          ? { categoryId }
          : {}),
        ...(updates.userId !== undefined
          ? updates.userId
            ? { userId: updates.userId }
            : {}
          : userId
          ? { userId }
          : {}),
      };
      router.push(
        {
          pathname: '/dashboard/posts',
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [page, name, sortBy, sortDirection, categoryId, userId, router]
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
  }, [router?.query?.page, page]);

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
    // React Query automáticamente hace nueva petición porque 'page' cambió en queryKey
  };

  // 4. Handler para búsqueda
  const handleSearchChange = (searchValue: string) => {
    setName(searchValue);
    setPage(1);
    updateURL({ name: searchValue, page: 1 });
  };

  // 5. Handler para sorting
  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
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
      setSortBy('postponed_to');
      setSortDirection('desc');
      setPage(1);
      updateURL({ sortBy: 'postponed_to', sortDirection: 'desc', page: 1 });
    }
  };

  const deletePost = (id: string) => {
    setPostId(id);
    postDelete(id)
      .then(() => {
        toast.success('Post eliminado');
        // Refetch invalidará el cache y React Query hará nueva petición
        refetch();
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setOpenDeleteModal(false);
      });
  };

  return (
    <>
      <Head>
        <title>Coanime.net - Lista de Articulos</title>
      </Head>
      <AppLayout>
        <Modal
          title="Borrar Post"
          isOpen={openDeleteModal}
          toggleModal={() => setOpenDeleteModal(!openDeleteModal)}>
          <div className="flex flex-col gap-8">
            <p>
              ¿Estas seguro de borrar este post? ¡Esta acción no se puede
              deshacer!
            </p>
            <div className="flex flex-row justify-end gap-4">
              <Button
                variant="link"
                onClick={() => setOpenDeleteModal(!openDeleteModal)}>
                No
              </Button>
              <Button
                suffix={<TrashIcon className="w-4 h-4" />}
                onClick={() => postId && deletePost(postId)}
                className="flex flex-row items-center gap-2">
                <span>Si</span>
              </Button>
            </div>
          </div>
        </Modal>
        <div className="p-4 md:p-6">
          <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-row flex-wrap gap-4 justify-between items-center mb-4">
              <div className="flex flex-row gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="rounded-md p-2 text-orange-500 bg-orange-50 border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-orange-100 hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  aria-label="Volver al dashboard">
                  <ChevronLeftIcon className="w-5 h-5" />
                </Link>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                  Lista de artículos
                </h2>
              </div>
              <Link
                href="/dashboard/posts/create"
                className="font-semibold py-2 px-4 rounded-md transition-all duration-200 text-orange-600 bg-orange-100 hover:bg-orange-200 border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex flex-row justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            </div>

            <div className="bg-white overflow-hidden rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-4">
              <DataTable
                columns={columns}
                data={posts}
                isLoading={isLoading}
                searchPlaceholder="Buscar por título..."
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
                        value={categoryId}
                        onChange={(value) => {
                          setCategoryId(value);
                          setPage(1);
                          updateURL({ categoryId: value, page: 1 });
                        }}
                        options={filters?.categories || []}
                        placeholder="Todas las categorías"
                      />
                      <FilterSelect
                        value={userId}
                        onChange={(value) => {
                          setUserId(value);
                          setPage(1);
                          updateURL({ userId: value, page: 1 });
                        }}
                        options={filters?.users || []}
                        placeholder="Todos los autores"
                      />
                    </>
                  }
                />
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Posts;
