import Link from 'next/link';

import { Menu } from '@headlessui/react';

const DropdownLink = ({ href, icon = null, children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <Link
        href={href}
        {...props}
        className={`w-full flex flex-row justify-between text-left px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}>
        {icon ?? ''}
        {children}
      </Link>
    )}
  </Menu.Item>
);

export const DropdownButton = ({ icon = null, children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full flex flex-row justify-between text-left px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}
        {...props}>
        {icon ?? ''}
        {children}
      </button>
    )}
  </Menu.Item>
);

export default DropdownLink;
