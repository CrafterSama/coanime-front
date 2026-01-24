import Head from 'next/head';
import Link from 'next/link';

import { NewspaperIcon } from '@/components/icons';
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
import { PhotoIcon, TagIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const { data } = useDashboard();

  return (
    <>
      <Head>
        <title>Coanime.net - Dashboard</title>
      </Head>
      <AppLayout header={<SectionHeader backlink="/" text="Dashboard" />}>
        <div className="p-4">
          <div className="flex flex-col gap-6">
            {/* Welcome Section */}
            <Card className="shadow-md bg-gradient-to-br from-orange-50 via-white to-teal-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-1">
                      ¡Bienvenido de vuelta!
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Hola{' '}
                      <span className="font-semibold text-orange-600">
                        {user?.username || user?.name}
                      </span>
                      , aquí tienes un resumen de tu actividad
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Artículos Card */}
              <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-700">
                      Artículos
                    </CardTitle>
                    <div className="p-2.5 bg-orange-400 rounded-lg shadow-sm">
                      <Link
                        href="/dashboard/posts?page=1"
                        className="text-white">
                        <NewspaperIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {data?.postsCount || 0}
                  </div>
                  <CardDescription className="text-sm">
                    Total de artículos publicados
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Total Títulos Card */}
              <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-700">
                      Títulos
                    </CardTitle>
                    <div className="p-2.5 bg-teal-600 rounded-lg shadow-sm">
                      <Link
                        href="/dashboard/titles?page=1"
                        className="text-white">
                        <PhotoIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {data?.titlesCount || 0}
                  </div>
                  <CardDescription className="text-sm">
                    Total de títulos registrados
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Post más visitado Card */}
              <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-700">
                      Más Visitado
                    </CardTitle>
                    <div className="p-2.5 bg-violet-400 rounded-lg shadow-sm">
                      <Link
                        href={`/posts/${data?.mostVisitedPost?.slug}`}
                        className="text-white">
                        <NewspaperIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-violet-600 mb-1">
                    {data?.mostVisitedPost?.viewCounter || 0}
                  </div>
                  <CardDescription className="text-sm line-clamp-1">
                    {data?.mostVisitedPost?.title || 'N/A'}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Categoría con más Posts Card */}
              <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-700">
                      Top Categoría
                    </CardTitle>
                    <div className="p-2.5 bg-blue-400 rounded-lg shadow-sm">
                      <Link
                        href={`/categorias/${data?.mostPostsCategory?.slug}`}
                        className="text-white">
                        <TagIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {data?.mostPostsCategory?.postsCount || 0}
                  </div>
                  <CardDescription className="text-sm line-clamp-1">
                    {data?.mostPostsCategory?.name || 'N/A'}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Acciones Rápidas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Link
                      href="/dashboard/posts/create"
                      className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <NewspaperIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Crear Artículo
                        </h3>
                        <p className="text-sm text-gray-500">
                          Publica un nuevo artículo
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Link
                      href="/dashboard/titles/create"
                      className="flex items-center gap-4">
                      <div className="p-3 bg-teal-100 rounded-lg">
                        <PhotoIcon className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Crear Título
                        </h3>
                        <p className="text-sm text-gray-500">
                          Añade un nuevo título
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <svg
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Mi Perfil
                        </h3>
                        <p className="text-sm text-gray-500">
                          Edita tu información
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Dashboard;
