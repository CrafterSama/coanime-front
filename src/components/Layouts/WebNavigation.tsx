import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Permissions } from '@/components/modules/common/Permissions';
import { Logotype } from '@/components/ui/ApplicationLogo';
import Dropdown from '@/components/ui/Dropdown';
import DropdownLink, { DropdownButton } from '@/components/ui/DropdownLink';
import NavLink from '@/components/ui/NavLink';
import ResponsiveNavLink, {
  ResponsiveNavButton,
} from '@/components/ui/ResponsiveNavLink';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import {
  LogoutIcon,
  MenuIcon,
  TemplateIcon,
  XIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';

const Navigation = ({ user }) => {
  const router = useRouter();

  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className={`${
          router?.asPath?.includes('ecma') && 'border-b border-gray-200'
        }`}
      >
        {/* Primary Navigation Menu */}
        <div className={`max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <a className="relative w-48">
                    <Logotype
                      logoColor="#FE6A00"
                      lettersColor="#333333"
                      className="h-15"
                    />
                  </a>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <NavLink
                  href="/ecma/titulos"
                  active={router.pathname.includes('/ecma')}
                >
                  Enciclopedia
                </NavLink>
                <NavLink
                  href="/eventos"
                  active={router.pathname.includes('/eventos')}
                >
                  Eventos
                </NavLink>
              </div>
            </div>

            {/* Settings Dropdown */}
            <div className="hidden sm:flex sm:items-center sm:ml-6 z-10">
              {user ? (
                <Dropdown
                  align="right"
                  width={48}
                  trigger={
                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                      <div className="flex flex-row justify-start items-center gap-4 relative">
                        {user && (
                          <Image
                            src={
                              user?.profilePhotoPath
                                ? user?.profilePhotoPath
                                : DEFAULT_IMAGE
                            }
                            alt={user?.name}
                            className="rounded-full w-8 h-8"
                            width={48}
                            height={48}
                          />
                        )}
                        <span>{user?.name}</span>
                      </div>

                      <div className="ml-1">
                        <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                      </div>
                    </button>
                  }
                >
                  {/* Authentication */}
                  <Permissions>
                    <DropdownLink
                      href="/dashboard"
                      rel="nofollow"
                      icon={<TemplateIcon className="h-6 w-6 text-gray-700" />}
                    >
                      Dashboard
                    </DropdownLink>
                  </Permissions>
                  <DropdownLink
                    href="/perfil"
                    icon={<UserCircleIcon className="h-6 w-6 text-gray-700" />}
                  >
                    Perfil
                  </DropdownLink>
                  <DropdownButton
                    onClick={logout}
                    icon={<LogoutIcon className="h-6 w-6 text-gray-700" />}
                  >
                    Logout
                  </DropdownButton>
                </Dropdown>
              ) : (
                <>
                  <Link href="/login">
                    <a className="text-sm font-medium text-gray-700 underline">
                      Login
                    </a>
                  </Link>

                  <Link href="/register">
                    <a className="ml-4 text-sm font-medium text-gray-700 underline">
                      Register
                    </a>
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setOpen((open) => !open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                {open ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Navigation Menu */}
        <div
          className={`absolute top-16 ${
            open ? 'left-0' : '-left-[100%]'
          } bg-white transition-all w-full`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href="/ecma/titulos"
              active={router.pathname.includes('/ecma/titulos')}
            >
              Enciclopedia
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/eventos"
              active={router.pathname.includes('/eventos')}
            >
              Eventos
            </ResponsiveNavLink>
          </div>

          {/* Responsive Settings Options */}
          <div className="pt-4 pb-1 border-t border-gray-200">
            {user?.name ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0 relative">
                    {user?.name && (
                      <Image
                        src={
                          user?.profilePhotoPath
                            ? user?.profilePhotoPath
                            : DEFAULT_IMAGE
                        }
                        alt={user?.name}
                        className="rounded-full w-8 h-8"
                        width="48px"
                        height="48px"
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
                  <ResponsiveNavLink href="/perfil">
                    <span className="flex gap-2 justify-end items-center">
                      <UserCircleIcon className="h-6 w-6 text-gray-700" />{' '}
                      Perfil
                    </span>
                  </ResponsiveNavLink>
                  <ResponsiveNavButton onClick={logout}>
                    <span className="flex gap-2 justify-end items-center">
                      <LogoutIcon className="h-6 w-6 text-gray-700" /> Logout
                    </span>
                  </ResponsiveNavButton>
                </div>
              </>
            ) : (
              <div className="flex justify-end py-2 px-4">
                <Link href="/login">
                  <a className="text-sm font-medium text-gray-700 underline">
                    Login
                  </a>
                </Link>

                <Link href="/register">
                  <a className="ml-4 text-sm font-medium text-gray-700 underline">
                    Register
                  </a>
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
                className="py-4"
                href="/ecma/titulos"
                active={router.pathname?.includes('/ecma/titulos')}
              >
                Títulos
              </NavLink>
              <NavLink
                className="py-4"
                href="/ecma/personas"
                active={router.pathname?.includes('/ecma/personas')}
              >
                Personas
              </NavLink>
              <NavLink
                className="py-4"
                href="/ecma/revistas"
                active={router.pathname?.includes('/ecma/revistas')}
              >
                Revistas
              </NavLink>
              <NavLink
                className="py-4"
                href="/ecma/entidades"
                active={router.pathname?.includes('/ecma/entidades')}
              >
                Entidades
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {/*(router?.pathname === '/' ||
        router?.asPath.includes('/categorias/')) && (
        <div className="w-full bg-white sub-navbar">
          <div className="max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            <div className="flex justify-around items-center">
              <NavLink
                className="py-4"
                href="/"
                active={router.pathname === '/'}
              >
                Principal
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/anime"
                active={router.pathname?.includes('/categorias/anime')}
              >
                Anime
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/manga"
                active={router.pathname?.includes('/categorias/manga')}
              >
                Manga
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/juegos"
                active={router.pathname?.includes('/categorias/juegos')}
              >
                Juegos
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/peliculas"
                active={router.pathname?.includes('/categorias/peliculas')}
              >
                Películas
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/doramas"
                active={router.pathname?.includes('/categorias/doramas')}
              >
                Doramas
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/japon"
                active={router.pathname?.includes('/categorias/japon')}
              >
                Japón
              </NavLink>
              <NavLink
                className="py-4"
                href="/categorias/curiosidades"
                active={router.pathname?.includes('/categorias/curiosidades')}
              >
                Curiosidades
              </NavLink>
            </div>
          </div>
        </div>
        )*/}
    </>
  );
};

export default Navigation;
