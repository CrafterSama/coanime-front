import Head from 'next/head';
import Link from 'next/link';

import {
  BookOpenIcon,
  LocationMarkerIcon,
  NewspaperIcon,
  OfficeBuildingIcon,
  PhotographIcon,
} from '@/components/icons';
import AppLayout from '@/components/Layouts/AppLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/auth';
import { useDashboard } from '@/hooks/dashboard';
import {
  ChevronRightIcon,
  PhotoIcon,
  TagIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const GREETINGS = {
  morning: 'Buenos días',
  afternoon: 'Buenas tardes',
  evening: 'Buenas noches',
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS.morning;
  if (hour < 19) return GREETINGS.afternoon;
  return GREETINGS.evening;
};

const STAT_CARD_CLASS =
  'group rounded-md bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-all duration-200 border border-gray-100';

const QUICK_ACTION_BASE =
  'flex items-center gap-4 w-full p-5 rounded-md text-left transition-all duration-200 hover:bg-gray-50/80 focus:outline-none hover:ring-0 hover:ring-offset-0 hover:shadow-none';

// Focus ring + colored shadow per accent (ring and shadow attenuate on hover)
const focusOrange =
  'focus-visible:ring-4 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(249,115,22,0.4)]';
const focusTeal =
  'focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(20,184,166,0.4)]';
const focusViolet =
  'focus-visible:ring-4 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(139,92,246,0.4)]';
const focusBlue =
  'focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(59,130,246,0.4)]';
const focusAmber =
  'focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(245,158,11,0.4)]';
const focusEmerald =
  'focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(16,185,129,0.4)]';
const focusSlate =
  'focus-visible:ring-4 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(100,116,139,0.4)]';
const focusRose =
  'focus-visible:ring-4 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(244,63,94,0.4)]';

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 ${className}`}
    aria-hidden
  />
);

const Dashboard = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const { data, isLoading } = useDashboard();
  const greeting = getGreeting();

  return (
    <>
      <Head>
        <title>Coanime.net - Dashboard</title>
      </Head>
      <AppLayout header={<SectionHeader backlink="/" text="Dashboard" />}>
        <div className="w-full p-4 md:p-6">
          <div className="flex w-full flex-col gap-8">
            {/* Welcome Section */}
            <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="bg-gradient-to-br from-orange-50/80 via-white to-teal-50/60 px-6 py-6">
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  {greeting}
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                  Hola,{' '}
                  <span className="text-orange-600">
                    {user?.username || user?.name}
                  </span>
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Aquí tienes un resumen de tu actividad y accesos rápidos.
                </p>
              </div>
            </Card>

            {/* Stats Cards Grid */}
            <section aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">
                Resumen de estadísticas
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Artículos */}
                <Card className={STAT_CARD_CLASS}>
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-700">
                        Artículos
                      </CardTitle>
                      <Link
                        href="/dashboard/posts?page=1"
                        className="rounded-md p-2.5 text-white shadow-sm bg-orange-500 hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(249,115,22,0.45)] hover:ring-0 hover:ring-offset-0 hover:shadow-none transition-all duration-200"
                        aria-label="Ver artículos">
                        <NewspaperIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    {isLoading ? (
                      <Skeleton className="mb-2 h-9 w-16" />
                    ) : (
                      <div className="text-2xl font-bold text-orange-600">
                        {data?.postsCount ?? 0}
                      </div>
                    )}
                    <CardDescription className="text-sm">
                      Total de artículos publicados
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Títulos */}
                <Card className={STAT_CARD_CLASS}>
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-700">
                        Títulos
                      </CardTitle>
                      <Link
                        href="/dashboard/titles?page=1"
                        className="rounded-md p-2.5 text-white shadow-sm bg-teal-500 hover:bg-teal-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(20,184,166,0.45)] hover:ring-0 hover:ring-offset-0 hover:shadow-none transition-all duration-200"
                        aria-label="Ver títulos">
                        <PhotoIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    {isLoading ? (
                      <Skeleton className="mb-2 h-9 w-16" />
                    ) : (
                      <div className="text-2xl font-bold text-teal-600">
                        {data?.titlesCount ?? 0}
                      </div>
                    )}
                    <CardDescription className="text-sm">
                      Total de títulos registrados
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Más Visitado */}
                <Card className={STAT_CARD_CLASS}>
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-700">
                        Más Visitado
                      </CardTitle>
                      {data?.mostVisitedPost?.slug && (
                        <Link
                          href={`/posts/${data.mostVisitedPost.slug}`}
                          className="rounded-md p-2.5 text-white shadow-sm bg-violet-500 hover:bg-violet-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(139,92,246,0.45)] hover:ring-0 hover:ring-offset-0 hover:shadow-none transition-all duration-200"
                          aria-label="Ver artículo más visitado">
                          <NewspaperIcon className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    {isLoading ? (
                      <Skeleton className="mb-2 h-9 w-12" />
                    ) : (
                      <div className="text-2xl font-bold text-violet-600">
                        {data?.mostVisitedPost?.viewCounter ?? 0}
                      </div>
                    )}
                    <CardDescription className="text-sm line-clamp-2">
                      {data?.mostVisitedPost?.title ?? '—'}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Top Categoría */}
                <Card className={STAT_CARD_CLASS}>
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-700">
                        Top Categoría
                      </CardTitle>
                      {data?.mostPostsCategory?.slug && (
                        <Link
                          href={`/categorias/${data.mostPostsCategory.slug}`}
                          className="rounded-md p-2.5 text-white shadow-sm bg-blue-500 hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_rgba(59,130,246,0.45)] hover:ring-0 hover:ring-offset-0 hover:shadow-none transition-all duration-200"
                          aria-label="Ver categoría">
                          <TagIcon className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    {isLoading ? (
                      <Skeleton className="mb-2 h-9 w-14" />
                    ) : (
                      <div className="text-2xl font-bold text-blue-600">
                        {data?.mostPostsCategory?.postsCount ?? 0}
                      </div>
                    )}
                    <CardDescription className="text-sm line-clamp-2">
                      {data?.mostPostsCategory?.name ?? '—'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick Actions */}
            <section aria-labelledby="quick-actions-heading">
              <h2
                id="quick-actions-heading"
                className="mb-4 text-lg font-semibold text-gray-800">
                Acciones rápidas
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/posts/create"
                    className={`${QUICK_ACTION_BASE} ${focusOrange}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                      <NewspaperIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Crear artículo
                      </span>
                      <span className="block text-sm text-gray-500">
                        Publica un nuevo artículo
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/titles/create"
                    className={`${QUICK_ACTION_BASE} ${focusTeal}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                      <PhotographIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Crear título
                      </span>
                      <span className="block text-sm text-gray-500">
                        Añade un nuevo título
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/profile"
                    className={`${QUICK_ACTION_BASE} ${focusViolet}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                      <UserCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Mi perfil
                      </span>
                      <span className="block text-sm text-gray-500">
                        Edita tu información
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/media"
                    className={`${QUICK_ACTION_BASE} ${focusBlue}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                      <PhotoIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Gestión de media
                      </span>
                      <span className="block text-sm text-gray-500">
                        Administra imágenes
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/people"
                    className={`${QUICK_ACTION_BASE} ${focusAmber}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Personas
                      </span>
                      <span className="block text-sm text-gray-500">
                        Gestión de personas
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/magazine"
                    className={`${QUICK_ACTION_BASE} ${focusEmerald}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                      <BookOpenIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Revistas
                      </span>
                      <span className="block text-sm text-gray-500">
                        Gestión de revistas
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/companies"
                    className={`${QUICK_ACTION_BASE} ${focusSlate}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <OfficeBuildingIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Empresas
                      </span>
                      <span className="block text-sm text-gray-500">
                        Gestión de empresas
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>

                <Card className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <Link
                    href="/dashboard/events"
                    className={`${QUICK_ACTION_BASE} ${focusRose}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-600">
                      <LocationMarkerIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">
                        Eventos
                      </span>
                      <span className="block text-sm text-gray-500">
                        Gestión de eventos
                      </span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
                  </Link>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Dashboard;
