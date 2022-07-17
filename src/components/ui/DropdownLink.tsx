import Link from 'next/link';
import { Menu } from '@headlessui/react';

const DropdownLink = ({ icon = null, children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <Link href={''} {...props}>
        <a
          className={`w-full flex flex-row justify-between text-left px-4 py-2 text-sm leading-5 text-gray-700 ${
            active ? 'bg-gray-100' : ''
          } focus:outline-none transition duration-150 ease-in-out`}
        >
          {icon ?? ''}
          {children}
        </a>
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
        {...props}
      >
        {icon ?? ''}
        {children}
      </button>
    )}
  </Menu.Item>
);

export default DropdownLink;
