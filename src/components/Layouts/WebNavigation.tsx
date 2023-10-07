import { useState } from 'react';

import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Permissions } from '@/components/modules/common/Permissions';
import SearchBox from '@/components/modules/common/SearchBox';
import { CoanimeIcon, Logotype } from '@/components/ui/ApplicationLogo';
import Dropdown from '@/components/ui/Dropdown';
import DropdownLink, { DropdownButton } from '@/components/ui/DropdownLink';
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
  RectangleGroupIcon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  QueueListIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const Navigation = ({ user }) => {
  const router = useRouter();

  const { logout, user: checkUser } = useAuth();

  const [open, setOpen] = useState(false);

  const navStyles = cn({
    'border-b border-gray-200': router?.asPath?.includes('ecma'),
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
                  className="relative w-48 flex flex-row items-center gap-2">
                  <CoanimeIcon className="h-24 text-orange-600" />
                  <Logotype className="h-16 text-gray-800" />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden space-x-8 sm:-my-px sm:ml-10 lg:flex">
                <NavLink
                  href="/ecma/titulos"
                  active={router.pathname.includes('/ecma')}>
                  Enciclopedia
                </NavLink>
                <NavLink
                  href="/eventos"
                  active={router.pathname.includes('/eventos')}>
                  Eventos
                </NavLink>
              </div>
            </div>

            <div className="hidden lg:flex items-center min-w-[300px] px-2">
              <SearchBox />
            </div>
            {/* Settings Dropdown */}
            <div className="hidden lg:flex sm:gap-8 sm:items-center sm:ml-6 z-10 w-[230px]">
              {/* Search Input */}
              <Show condition={user}>
                <Dropdown
                  align="right"
                  width={48}
                  trigger={
                    <div className="flex flex-row gap-1 text-sm font-semibold items-center text-gray-500 cursor-pointer">
                      <div className="flex items-center relative w-10 h-10">
                        <Show condition={user}>
                          <Image
                            src={
                              user?.profilePhotoPath
                                ? user?.profilePhotoPath
                                : DEFAULT_IMAGE
                            }
                            alt={user?.name}
                            className="rounded-full w-8 h-8 object-cover"
                            unoptimized
                            width={36}
                            height={36}
                          />
                        </Show>
                      </div>
                      <span className="whitespace-nowrap">{user?.name}</span>
                      <div className="ml-1 col-span-1">
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  }>
                  {/* Authentication */}
                  <Permissions>
                    <DropdownLink
                      href={checkUser ? '/dashboard' : '/login'}
                      rel="nofollow"
                      icon={
                        <RectangleGroupIcon className="h-6 w-6 text-gray-700" />
                      }>
                      Dashboard
                    </DropdownLink>
                  </Permissions>
                  <DropdownLink
                    href={`/users/${user?.slug}`}
                    icon={<UserCircleIcon className="h-6 w-6 text-gray-700" />}>
                    Perfil
                  </DropdownLink>
                  <DropdownLink
                    href="/mi-lista"
                    icon={<QueueListIcon className="h-6 w-6 text-gray-700" />}>
                    Mi Lista
                  </DropdownLink>
                  <DropdownButton
                    onClick={logout}
                    icon={
                      <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-700" />
                    }>
                    Logout
                  </DropdownButton>
                </Dropdown>
              </Show>
              <Show condition={!user}>
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
              </Show>
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
          <div className="pt-4 pb-1 border-t border-gray-200">
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
                  <ResponsiveNavButton onClick={logout}>
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
