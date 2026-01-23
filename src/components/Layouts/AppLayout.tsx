import { ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Aside from '@/components/ui/Aside';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Show } from '@/components/ui/Show';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import { hasRole } from '@/utils/common';
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface AppLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

const AppLayout = ({ header, children }: AppLayoutProps) => {
  const router = useRouter();
  const { user, logout } = useAuth({ middleware: 'auth' });

  useEffect(() => {
    if (user && user?.roles?.length === 1 && hasRole(user?.roles, 'user')) {
      toast.error('You do not have permission to access this page');
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <SidebarProvider defaultOpen={true}>
        <div id="top" className="flex flex-row min-h-screen w-full bg-gray-50">
          <Aside />
          <SidebarInset className="flex flex-col flex-1 w-full">
            <div className="flex items-center justify-between gap-2 px-4 py-2 bg-white shadow-sm h-16 w-full">
              <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger />
                {header && <div className="flex-1">{header}</div>}
              </div>
              {/* User Menu */}
              <div className="flex items-center">
                <Show condition={user}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                        <div className="flex flex-row justify-start items-center gap-3">
                          <Avatar className="w-10 h-10 ring-2 ring-gray-200 hover:ring-orange-500 transition-all">
                            <AvatarImage
                              src={
                                user?.profilePhotoPath
                                  ? user?.profilePhotoPath
                                  : DEFAULT_IMAGE
                              }
                              alt={user?.name}
                            />
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              {user?.name
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden sm:block text-gray-700 font-medium">
                            {user?.name}
                          </span>
                        </div>
                        <div className="ml-2">
                          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 bg-white shadow-lg rounded-lg">
                      {/* User Info Header */}
                      <DropdownMenuLabel className="px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                            <AvatarImage
                              src={
                                user?.profilePhotoPath
                                  ? user?.profilePhotoPath
                                  : DEFAULT_IMAGE
                              }
                              alt={user?.name}
                            />
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              {user?.name
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {user?.name || 'Usuario'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>

                      {/* Menu Items */}
                      <div className="py-1">
                        {router.pathname !== '/dashboard' && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                              <RectangleGroupIcon className="h-5 w-5 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Dashboard
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem asChild>
                          <Link
                            href={user?.slug ? `/users/${user.slug}` : '#'}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                            <UserCircleIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Ver Perfil
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                            <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Editar Perfil
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator className="bg-gray-100" />

                      {/* Logout */}
                      <div className="py-1">
                        <DropdownMenuItem
                          onClick={logout}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors">
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">Cerrar Sesión</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Show>
              </div>
            </div>
            <section className="flex-1 bg-gray-50 overflow-x-hidden w-full">{children}</section>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
