import { FC, useState } from 'react';

import { useRouter } from 'next/router';

import { MenuIcon, LogoutIcon } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ResponsiveNavLink, {
  ResponsiveNavButton,
} from '@/components/ui/ResponsiveNavLink';
import { Show } from '@/components/ui/Show';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useAuth } from '@/hooks/auth';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type NavigationProps = {
  user?: any;
  menuActionButton: () => void;
};

const Navigation: FC<NavigationProps> = ({
  user = {},
  menuActionButton = () => {
    //
  },
}) => {
  const router = useRouter();

  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      {/* Primary Navigation Menu */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex cursor-pointer sm:block"
            onClick={menuActionButton}>
            <MenuIcon className="h-6 w-6 text-gray-400" />
          </div>
          {/* Settings Dropdown */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <Show condition={user}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-gray-200 hover:ring-orange-500 transition-all">
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
                      <span className="hidden sm:block">{user?.name}</span>
                    </div>

                    <div className="ml-1">
                      <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white shadow-lg rounded-lg">
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors">
                    <LogoutIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Show>
          </div>

          {/* Hamburger - Mobile Menu */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24">
                    {open ? (
                      <path
                        className="inline-flex"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        className="inline-flex"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <ResponsiveNavLink
                    href="/dashboard"
                    active={router.pathname === '/dashboard'}>
                    Dashboard
                  </ResponsiveNavLink>
                  <Separator />
                  {user?.name && (
                    <>
                      <div className="flex items-center px-4 py-3">
                        <Avatar className="w-12 h-12 mr-3">
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
                        <div>
                          <div className="font-medium text-base text-gray-800">
                            {user?.name}
                          </div>
                          <div className="font-medium text-sm text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  <ResponsiveNavButton onClick={() => logout()}>
                    Logout
                  </ResponsiveNavButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
