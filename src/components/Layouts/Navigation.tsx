import { FC, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { MenuIcon, LogoutIcon } from '@/components/icons';
import Dropdown from '@/components/ui/Dropdown';
import { DropdownButton } from '@/components/ui/DropdownLink';
import ResponsiveNavLink, {
  ResponsiveNavButton,
} from '@/components/ui/ResponsiveNavLink';
import { Show } from '@/components/ui/Show';
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
    <nav className="bg-white border-b border-gray-100">
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
              <Dropdown
                align="right"
                trigger={
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out w-12 h-12">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {
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
                      }
                      <span>{user?.name}</span>
                    </div>

                    <div className="ml-1">
                      <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                    </div>
                  </button>
                }>
                {/* Authentication */}
                {/*<DropdownLink
                  href="/dashboard/profile"
                  scroll={true}
                  icon={<UserCircleIcon className="h-6 w-6 text-gray-400" />}>
                  Profile
                </DropdownLink>*/}
                <DropdownButton
                  icon={<LogoutIcon className="h-6 w-6 text-gray-400" />}
                  onClick={logout}>
                  Logout
                </DropdownButton>
              </Dropdown>
            </Show>
          </div>

          {/* Hamburger */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setOpen((open) => !open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
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
          </div>
        </div>
      </div>

      {/* Responsive Navigation Menu */}
      {open && (
        <div className="block sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href="/dashboard"
              active={router.pathname === '/dashboard'}>
              Dashboard
            </ResponsiveNavLink>
          </div>

          {/* Responsive Settings Options */}
          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-10 w-10 fill-current text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
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
              <ResponsiveNavButton onClick={logout}>Logout</ResponsiveNavButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
