import { useState } from 'react';

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Permissions } from '@/components/modules/common/Permissions';
import SearchBox from '@/components/modules/common/SearchBox';
import { CoanimeIcon } from '@/components/ui/ApplicationLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavLink from '@/components/ui/NavLink';
import ResponsiveNavLink, {
  ResponsiveNavButton,
} from '@/components/ui/ResponsiveNavLink';
import { Show } from '@/components/ui/Show';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
  QueueListIcon,
  RectangleGroupIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navigation = ({ user }: { user: any }) => {
  const router = useRouter();

  const { logout, user: checkUser } = useAuth();

  const [open, setOpen] = useState(false);

  const navStyles = cn({
    'shadow-sm': router?.asPath?.includes('ecma'),
  });
  const navigationStyles = cn(
    'absolute top-16 bg-white transition-all w-full',
    {
      'left-0': open,
      '-left-[100%]': !open,
    }
  );

  return (
    <>
      <nav className={navStyles}>
        {/* Primary Navigation Menu */}
        <div className={`max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex justify-between h-16">
            <div className="flex gap-4">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  className="relative flex flex-row items-center gap-2">
                  <CoanimeIcon className="h-8 w-8 text-orange-500" />
                  <span className="text-xl font-bold text-orange-500">
                    COANIME
                  </span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden space-x-6 sm:-my-px sm:ml-6 lg:flex items-center">
                <NavLink
                  href="/"
                  active={router.pathname === '/'}
                  className="flex items-center gap-1">
                  <HomeIcon className="w-5 h-5" />
                </NavLink>
                <NavLink
                  href="/ecma/titulos"
                  active={router.pathname.includes('/ecma')}
                  className="flex items-center gap-1">
                  Enciclopedia
                </NavLink>
                <NavLink
                  href="/eventos"
                  active={router.pathname.includes('/eventos')}>
                  Eventos
                </NavLink>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {/* Search Box */}
              <div className="min-w-[200px]">
                <SearchBox />
              </div>

              {/* Login/Register Buttons or User Menu */}
              <div className="flex items-center gap-2">
                <Show condition={user}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex flex-row gap-2 text-sm font-semibold items-center text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg px-2 py-1.5 transition-colors">
                        <div className="flex items-center relative w-10 h-10">
                          <Image
                            src={
                              user?.profilePhotoPath
                                ? user?.profilePhotoPath
                                : DEFAULT_IMAGE
                            }
                            alt={user?.name || 'Usuario'}
                            className="rounded-full w-10 h-10 object-cover ring-2 ring-gray-200 hover:ring-orange-500 transition-all"
                            unoptimized
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="whitespace-nowrap hidden sm:block">
                          {user?.name}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400 hidden sm:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white shadow-xl rounded-lg overflow-hidden">
                      {/* Authentication */}
                      <Permissions>
                        <DropdownMenuItem asChild>
                          <Link
                            href={checkUser ? '/dashboard' : '/login'}
                            rel="nofollow"
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                            <RectangleGroupIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Dashboard
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </Permissions>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/users/${user?.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                          <UserCircleIcon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Perfil
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/mi-lista"
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 focus:bg-orange-50 transition-colors">
                          <QueueListIcon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Mi Lista
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors">
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Show>
                <Show condition={!user}>
                  <Link href="/login">
                    <Button variant="link">Login</Button>
                  </Link>

                  <Link href="/register">
                    <Button variant="solid-orange">Registro</Button>
                  </Link>
                </Show>
              </div>
            </div>

            {/* Hamburger */}
            <div className="-mr-2 flex items-center lg:hidden">
              <button
                onClick={() => setOpen((open) => !open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                <Show condition={open}>
                  <XMarkIcon className="w-6 h-6" />
                </Show>
                <Show condition={!open}>
                  <Bars3Icon className="w-6 h-6" />
                </Show>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Navigation Menu */}
        <div className={navigationStyles}>
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href="/ecma/titulos"
              active={router.pathname.includes('/ecma/titulos')}>
              Enciclopedia
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/eventos"
              active={router.pathname.includes('/eventos')}>
              Eventos
            </ResponsiveNavLink>
          </div>
          {/*<div className="lg:hidden flex justify-center items-center min-w-[300px] px-4 py-2">
          <SearchBox />
        </div>*/}

          {/* Responsive Settings Options */}
          <div className="pt-4 pb-1 shadow-[0_-1px_0_0_rgba(0,0,0,0.05)]">
            {user?.name ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0 relative w-12 h-12">
                    {user?.name && (
                      <Image
                        src={
                          user?.profilePhotoPath
                            ? user?.profilePhotoPath
                            : DEFAULT_IMAGE
                        }
                        alt={user?.name}
                        className="rounded-full w-full h-full object-cover"
                        fill
                        unoptimized
                      />
                    )}
                  </div>

                  <div className="ml-3">
                    <div className="font-medium text-base text-gray-800">
                      {user?.name}
                    </div>
                    <div className="font-medium text-sm text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  {/* Authentication */}
                  <Permissions>
                    <ResponsiveNavLink href="/dashboard">
                      <span className="flex gap-2 justify-end items-center">
                        <RectangleGroupIcon className="h-6 w-6 text-gray-700" />{' '}
                        Dashboard
                      </span>
                    </ResponsiveNavLink>
                  </Permissions>
                  <ResponsiveNavLink href={`/users/${user.slug}`}>
                    <span className="flex gap-2 justify-end items-center">
                      <UserCircleIcon className="h-6 w-6 text-gray-700" />{' '}
                      Perfil
                    </span>
                  </ResponsiveNavLink>
                  <ResponsiveNavLink href="/mi-lista">
                    <span className="flex gap-2 justify-end items-center">
                      <QueueListIcon className="h-6 w-6 text-gray-700" /> Mi
                      Lista
                    </span>
                  </ResponsiveNavLink>
                  <ResponsiveNavButton onClick={() => logout()}>
                    <span className="flex gap-2 justify-end items-center">
                      <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-700" />{' '}
                      Logout
                    </span>
                  </ResponsiveNavButton>
                </div>
              </>
            ) : (
              <div className="flex justify-end py-2 px-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 underline">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="ml-4 text-sm font-medium text-gray-700 underline">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      {router?.asPath?.includes('ecma') && (
        <div className="w-full bg-white sub-navbar">
          <div className="max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            <div className="space-x-8 sm:ml-10 sm:flex">
              <NavLink
                className="py-4 whitespace-nowrap"
                href="/ecma/titulos"
                active={router.pathname?.includes('/ecma/titulos')}>
                Títulos
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap"
                href="/ecma/personas"
                active={router.pathname?.includes('/ecma/personas')}>
                Personas
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap"
                href="/ecma/revistas"
                active={router.pathname?.includes('/ecma/revistas')}>
                Revistas
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap"
                href="/ecma/entidades"
                active={router.pathname?.includes('/ecma/entidades')}>
                Entidades
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {(router?.pathname === '/' ||
        router?.asPath.includes('/categorias/')) && (
        <div className="w-full bg-white sub-navbar">
          <div className="max-w-7xl container mx-auto px-2 sm:px-4 lg:px-6 bg-white">
            <div className="flex flex-row gap-1 justify-around items-center">
              <NavLink
                className="py-4 whitespace-nowrap w-fit desktop"
                href="/"
                active={router.pathname === '/'}>
                <HomeIcon className="w-6 h-6 text-gray-800" />
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap w-fit"
                href="/categorias/cultura-otaku"
                active={router.pathname === '/categorias/cultura-otaku'}>
                Cultura Otaku
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap w-fit"
                href="/categorias/anime"
                active={router.pathname?.includes('/categorias/anime')}>
                Anime
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap w-fit"
                href="/categorias/manga"
                active={router.pathname?.includes('/categorias/manga')}>
                Manga
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap w-fit"
                href="/categorias/juegos"
                active={router.pathname?.includes('/categorias/juegos')}>
                Juegos
              </NavLink>
              <NavLink
                className="py-4 whitespace-nowrap w-fit"
                href="/categorias/japon"
                active={router.pathname?.includes(
                  '/categorias/analisis-reviews'
                )}>
                Japón
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
