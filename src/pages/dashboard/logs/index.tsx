import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SortingState } from '@tanstack/react-table';

import AppLayout from '@/components/Layouts/AppLayout';
import {
  createActivityLogColumns,
  type ActivityLogRow,
} from '@/components/modules/activity-logs/columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import {
  useActivityLog,
  useActivityLogs,
  useActivityLogStats,
} from '@/hooks/activity-logs';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const Logs = () => {
  const router = useRouter();

  const [page, setPage] = useState(() =>
    router?.query?.page ? Number(router.query.page) : 1
  );
  const [description, setDescription] = useState(
    (router?.query?.description as string) || ''
  );
  const [fromDate, setFromDate] = useState(
    (router?.query?.fromDate as string) || ''
  );
  const [toDate, setToDate] = useState((router?.query?.toDate as string) || '');
  const [controller, setController] = useState(
    (router?.query?.controller as string) || ''
  );
  const [showAll, setShowAll] = useState(
    router?.query?.all === '1' || router?.query?.all === 'true'
  );
  const [sortBy, setSortBy] = useState<string>(
    (router?.query?.sortBy as string) || 'created_at'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    (router?.query?.sortDirection as 'asc' | 'desc') || 'desc'
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const logsParams = useMemo(
    () => ({
      page,
      perPage: 20,
      description: description || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      controller: controller || undefined,
      all: showAll,
      sortBy,
      sortOrder: sortDirection,
    }),
    [
      page,
      description,
      fromDate,
      toDate,
      controller,
      showAll,
      sortBy,
      sortDirection,
    ]
  );

  const statsParams = useMemo(
    () => ({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [fromDate, toDate]
  );

  const { data: logsData = {}, isLoading } = useActivityLogs(logsParams);
  const { data: statsData = {} } = useActivityLogStats(statsParams);
  const { data: detailData, isLoading: detailLoading } = useActivityLog(
    selectedLogId,
    detailOpen && selectedLogId != null
  );

  const result = logsData?.result ?? logsData;
  const logs = (result?.data ?? []) as ActivityLogRow[];
  const stats = statsData?.result ?? statsData;

  const updateURL = useCallback(
    (updates: Record<string, unknown>) => {
      const q: Record<string, string | number> = {
        page: String(updates.page ?? page),
        ...(updates.description !== undefined
          ? (updates.description as string)
            ? { description: updates.description as string }
            : {}
          : description
          ? { description }
          : {}),
        ...(updates.fromDate !== undefined
          ? (updates.fromDate as string)
            ? { fromDate: updates.fromDate as string }
            : {}
          : fromDate
          ? { fromDate }
          : {}),
        ...(updates.toDate !== undefined
          ? (updates.toDate as string)
            ? { toDate: updates.toDate as string }
            : {}
          : toDate
          ? { toDate }
          : {}),
        ...(updates.controller !== undefined
          ? (updates.controller as string)
            ? { controller: updates.controller as string }
            : {}
          : controller
          ? { controller }
          : {}),
        ...(updates.all !== undefined
          ? { all: (updates.all as boolean) ? '1' : '0' }
          : showAll
          ? { all: '1' }
          : {}),
        ...(updates.sortBy !== undefined && (updates.sortBy as string)
          ? { sortBy: updates.sortBy as string }
          : sortBy
          ? { sortBy }
          : {}),
        ...(updates.sortDirection !== undefined &&
        (updates.sortDirection as string)
          ? { sortDirection: updates.sortDirection as string }
          : sortDirection
          ? { sortDirection }
          : {}),
      };
      router.push({ pathname: '/dashboard/logs', query: q }, undefined, {
        shallow: true,
      });
    },
    [
      page,
      description,
      fromDate,
      toDate,
      controller,
      showAll,
      sortBy,
      sortDirection,
      router,
    ]
  );

  useEffect(() => {
    const urlPage = router?.query?.page ? Number(router.query.page) : 1;
    if (urlPage !== page) setPage(urlPage);
    else if (!router?.query?.page && page !== 1) setPage(1);
  }, [router?.query?.page]);

  useEffect(() => {
    if (result?.currentPage != null && result.currentPage !== page) {
      setPage(result.currentPage);
      updateURL({ page: result.currentPage });
    }
  }, [result?.currentPage, page, updateURL]);

  const onPageChange = (newPage: number) => {
    if (result && (newPage < 1 || newPage > (result.lastPage ?? 1))) return;
    setPage(newPage);
    updateURL({ page: newPage });
  };

  const handleSearchChange = (value: string) => {
    setDescription(value);
    setPage(1);
    updateURL({ description: value, page: 1 });
  };

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const id = sorting[0].id;
      const desc = sorting[0].desc;
      setSortBy(id);
      setSortDirection(desc ? 'desc' : 'asc');
      setPage(1);
      updateURL({ sortBy: id, sortDirection: desc ? 'desc' : 'asc', page: 1 });
    } else {
      setSortBy('created_at');
      setSortDirection('desc');
      setPage(1);
      updateURL({ sortBy: 'created_at', sortDirection: 'desc', page: 1 });
    }
  };

  const onView = (log: ActivityLogRow) => {
    setSelectedLogId(log.id);
    setDetailOpen(true);
  };

  const columns = useMemo(() => createActivityLogColumns(onView), []);

  const totalActivities = Number(
    stats?.totalActivities ?? stats?.total_activities ?? 0
  );
  const byController =
    stats?.activitiesByController ?? stats?.activities_by_controller ?? {};
  const controllerEntries = Array.isArray(byController)
    ? []
    : Object.entries(byController as Record<string, number>);

  return (
    <>
      <Head>
        <title>Coanime.net - Logs de actividad</title>
      </Head>
      <AppLayout>
        <div className="p-4 md:p-6">
          <div className="w-full">
            <div className="flex flex-row flex-wrap gap-4 justify-between items-center mb-4">
              <div className="flex flex-row gap-4 items-center">
                <Link
                  href="/dashboard"
                  className="rounded-md p-2 text-orange-500 bg-orange-50 border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-orange-100 hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  aria-label="Volver al dashboard">
                  <ChevronLeftIcon className="w-5 h-5" />
                </Link>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                  Logs de actividad
                </h2>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="rounded-md border border-gray-100 bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalActivities}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  actividades (filtro fechas)
                </p>
              </div>
              {controllerEntries.slice(0, 3).map(([name, count]) => (
                <div
                  key={name}
                  className="rounded-md border border-gray-100 bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <p
                    className="text-sm font-medium text-gray-500 truncate"
                    title={name}>
                    {name}
                  </p>
                  <p className="text-xl font-semibold text-gray-900">{count}</p>
                </div>
              ))}
            </div>

            <div className="bg-white overflow-hidden rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-4">
              <div className="flex flex-wrap gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                      updateURL({
                        fromDate: e.target.value || undefined,
                        page: 1,
                      });
                    }}
                    className="rounded border border-gray-200 px-2 py-1.5 text-sm"
                  />
                  Desde
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                      updateURL({
                        toDate: e.target.value || undefined,
                        page: 1,
                      });
                    }}
                    className="rounded border border-gray-200 px-2 py-1.5 text-sm"
                  />
                  Hasta
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Controlador"
                    value={controller}
                    onChange={(e) => setController(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setPage(1);
                        updateURL({
                          controller: controller || undefined,
                          page: 1,
                        });
                      }
                    }}
                    className="rounded border border-gray-200 px-2 py-1.5 text-sm w-40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPage(1);
                      updateURL({
                        controller: controller || undefined,
                        page: 1,
                      });
                    }}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 border border-gray-100">
                    Aplicar
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => {
                      setShowAll(e.target.checked);
                      setPage(1);
                      updateURL({ all: e.target.checked, page: 1 });
                    }}
                  />
                  Ver todos los usuarios
                </label>
                {(controller || fromDate || toDate || showAll) && (
                  <button
                    type="button"
                    onClick={() => {
                      setController('');
                      setFromDate('');
                      setToDate('');
                      setShowAll(false);
                      setPage(1);
                      setDescription('');
                      updateURL({
                        controller: undefined,
                        fromDate: undefined,
                        toDate: undefined,
                        all: false,
                        page: 1,
                        description: undefined,
                      });
                    }}
                    className="text-sm text-orange-600 hover:underline">
                    Limpiar filtros
                  </button>
                )}
              </div>

              <DataTable
                columns={columns}
                data={logs}
                isLoading={isLoading}
                searchPlaceholder="Buscar por descripción..."
                pagination={
                  result
                    ? {
                        pageIndex: (result.currentPage ?? 1) - 1,
                        pageSize: result.perPage ?? 20,
                        total: result.total ?? 0,
                        lastPage:
                          result.lastPage ??
                          (Math.ceil(
                            (result.total ?? 0) / (result.perPage ?? 20)
                          ) ||
                            1),
                        currentPage: result.currentPage ?? 1,
                        onPageChange,
                      }
                    : undefined
                }
                onSearchChange={handleSearchChange}
                onSortingChange={handleSortingChange}
                initialSearch={description}
                initialSorting={
                  sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : []
                }
              />
            </div>
          </div>
        </div>

        <Dialog open={detailOpen} onOpenChange={(open) => setDetailOpen(open)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-gray-900">
                Detalle del log
              </DialogTitle>
            </DialogHeader>
            {detailLoading && (
              <p className="text-sm text-gray-500">Cargando...</p>
            )}
            {!detailLoading && detailData?.result && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500 mb-1">Descripción</p>
                  <p className="text-gray-900">
                    {detailData.result.description ?? '—'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Usuario</p>
                    <p className="text-gray-900">
                      {detailData.result.causer?.name ??
                        `#${detailData.result.causerId ?? '—'}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Fecha</p>
                    <p className="text-gray-900">
                      {dayjs(detailData.result.createdAt).format(
                        'DD/MM/YYYY HH:mm:ss'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">
                      Controlador
                    </p>
                    <p className="font-mono text-gray-900">
                      {detailData.result.properties?.controllerName ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Método</p>
                    <p className="text-gray-900">
                      {detailData.result.properties?.method ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">HTTP</p>
                    <p className="text-gray-900">
                      {detailData.result.properties?.statusCode ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">IP</p>
                    <p className="font-mono text-gray-900 text-xs break-all">
                      {detailData.result.properties?.ipAddress ?? '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-500 mb-1">URL</p>
                  <p className="font-mono text-gray-900 text-xs break-all">
                    {detailData.result.properties?.url ?? '—'}
                  </p>
                </div>
                {detailData.result.properties?.userAgent && (
                  <div>
                    <p className="font-medium text-gray-500 mb-1">User-Agent</p>
                    <p className="font-mono text-gray-900 text-xs break-all">
                      {detailData.result.properties.userAgent}
                    </p>
                  </div>
                )}
                {detailData.result.properties?.requestData &&
                  Object.keys(detailData.result.properties.requestData).length >
                    0 && (
                    <div>
                      <p className="font-medium text-gray-500 mb-1">
                        Datos de la petición
                      </p>
                      <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto max-h-40 overflow-y-auto">
                        {JSON.stringify(
                          detailData.result.properties.requestData,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                {(detailData.result.properties?.responseBody ??
                  detailData.result.properties?.response_body) && (
                  <div>
                    <p className="font-medium text-gray-500 mb-1">
                      Respuesta del servidor
                      {(detailData.result.properties?.responseTruncated ??
                        detailData.result.properties?.response_truncated) && (
                        <span className="ml-2 text-xs font-normal text-amber-600">
                          (truncada)
                        </span>
                      )}
                    </p>
                    <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap break-words font-mono">
                      {detailData.result.properties?.responseBody ??
                        detailData.result.properties?.response_body}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    </>
  );
};

export default Logs;
