import React, { useEffect, useState, useCallback } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { createMediaColumns } from '@/components/modules/media/columns';
import { DataTable } from '@/components/ui/data-table';
import { FilterSelect } from '@/components/ui/filter-select';
import { useMedia } from '@/hooks/media';
import { PhotoIcon } from '@heroicons/react/24/outline';
import SectionHeader from '@/components/ui/SectionHeader';
import { EditMediaModal } from '@/components/modules/media/EditMediaModal';

const Media = () => {
  const router = useRouter();

  // Inicializar page desde URL o default 1
  const initialPage = router?.query?.page ? Number(router.query.page) : 1;

  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(
    (router?.query?.search as string) || ''
  );
  const [sortBy, setSortBy] = useState<string>(
    (router?.query?.sortBy as string) || 'created_at'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    (router?.query?.sortDirection as 'asc' | 'desc') || 'desc'
  );
  const [modelType, setModelType] = useState<string | undefined>(
    (router?.query?.modelType as string) || undefined
  );
  const [collection, setCollection] = useState<string | undefined>(
    (router?.query?.collection as string) || undefined
  );
  const [isPlaceholder, setIsPlaceholder] = useState<boolean | undefined>(
    router?.query?.isPlaceholder === 'true' ? true : undefined
  );
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  // React Query: cache automático por queryKey
  const {
    data = {},
    isLoading,
    refetch,
  } = useMedia({
    page,
    search,
    sortBy,
    sortDirection,
    modelType,
    collection,
    isPlaceholder,
  });

  const result = data?.result || data;
  const media = result?.data || data?.data || [];
  const filters = data?.filters || {};
  const columns = React.useMemo(
    () => createMediaColumns(setMediaId, setOpenEditModal),
    [setMediaId, setOpenEditModal]
  );

  // Helper para actualizar URL con todos los filtros
  const updateURL = useCallback(
    (updates: Record<string, any>) => {
      const query: Record<string, any> = {
        page: updates.page ?? page,
        ...(updates.search !== undefined
          ? updates.search
            ? { search: updates.search }
            : {}
          : search
          ? { search }
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
        ...(updates.modelType !== undefined
          ? updates.modelType
            ? { modelType: updates.modelType }
            : {}
          : modelType
          ? { modelType }
          : {}),
        ...(updates.collection !== undefined
          ? updates.collection
            ? { collection: updates.collection }
            : {}
          : collection
          ? { collection }
          : {}),
        ...(updates.isPlaceholder !== undefined
          ? updates.isPlaceholder
            ? { isPlaceholder: 'true' }
            : {}
          : isPlaceholder
          ? { isPlaceholder: 'true' }
          : {}),
      };
      router.push(
        {
          pathname: '/dashboard/media',
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [page, search, sortBy, sortDirection, modelType, collection, isPlaceholder, router]
  );

  // Sincronizar URL → Estado
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

  // Sincronizar Backend → Estado/URL
  useEffect(() => {
    if (result?.currentPage && result.currentPage !== page) {
      const backendPage = result.currentPage;
      setPage(backendPage);
      updateURL({ page: backendPage });
    }
  }, [result?.currentPage, page, updateURL]);

  // Función directa: actualiza estado y URL
  const onPageChange = async (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage });
  };

  // Handlers para filtros
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleModelTypeChange = (value: string | undefined) => {
    setModelType(value);
    setPage(1);
    updateURL({ modelType: value, page: 1 });
  };

  const handleCollectionChange = (value: string | undefined) => {
    setCollection(value);
    setPage(1);
    updateURL({ collection: value, page: 1 });
  };

  const handlePlaceholderToggle = (value: boolean) => {
    setIsPlaceholder(value);
    setPage(1);
    updateURL({ isPlaceholder: value, page: 1 });
  };

  const handleModalClose = () => {
    setOpenEditModal(false);
    setMediaId(null);
    refetch();
  };

  return (
    <>
      <Head>
        <title>Coanime.net - Gestión de Media</title>
      </Head>
      <AppLayout
        header={
          <SectionHeader backlink="/dashboard" text="Gestión de Media" />
        }>
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-6">
            {/* Header con búsqueda y filtros */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md p-2 bg-orange-50 border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                    <PhotoIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800 leading-tight">
                      Gestión de Media
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Administra todas las imágenes del sistema
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de media */}
            <div className="bg-white overflow-hidden rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-4">
              <DataTable
              columns={columns}
              data={media}
              isLoading={isLoading}
              searchPlaceholder="Buscar por nombre, archivo o modelo..."
              initialSearch={search}
              onSearchChange={handleSearchChange}
              pagination={{
                  currentPage: result?.currentPage || page,
                  lastPage: result?.lastPage || 1,
                  perPage: result?.perPage || 15,
                  total: result?.total || 0,
                  onPageChange,
                }}
                filters={
                  <>
                    <FilterSelect
                      value={modelType || ''}
                      onChange={(value) => handleModelTypeChange(value || undefined)}
                      options={[
                        { id: '', name: 'Todos los tipos' },
                        ...(filters?.model_types?.map((type: string) => ({
                          id: type,
                          name: type,
                        })) || []),
                      ]}
                      placeholder="Tipo de Modelo"
                    />

                    <FilterSelect
                      value={collection || ''}
                      onChange={(value) => handleCollectionChange(value || undefined)}
                      options={[
                        { id: '', name: 'Todas las colecciones' },
                        ...(filters?.collections?.map((col: string) => ({
                          id: col,
                          name: col,
                        })) || []),
                      ]}
                      placeholder="Colección"
                    />

                    <FilterSelect
                      value={isPlaceholder ? 'placeholder' : 'all'}
                      onChange={(value) =>
                        handlePlaceholderToggle(value === 'placeholder')
                      }
                      options={[
                        { id: 'all', name: 'Todos' },
                        { id: 'placeholder', name: 'Solo Placeholders' },
                      ]}
                      placeholder="Estado"
                    />
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Modal de edición */}
        {openEditModal && mediaId && (
          <EditMediaModal
            mediaId={mediaId}
            isOpen={openEditModal}
            onClose={handleModalClose}
          />
        )}
      </AppLayout>
    </>
  );
};

export default Media;
