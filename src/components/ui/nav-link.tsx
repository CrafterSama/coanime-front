import Link from 'next/link';
import React from 'react';

const NavLink = ({
  active = false,
  children,
  href,
  ...props
}: {
  active?: boolean;
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => (
  <Link
    href={href}
    {...props}
    className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? 'text-orange-500 focus:text-orange-600'
        : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'
    }`}>
    {children}
  </Link>
);

export default NavLink;
