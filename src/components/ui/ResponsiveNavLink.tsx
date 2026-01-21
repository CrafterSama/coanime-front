import React from 'react';
import Link from 'next/link';

const ResponsiveNavLink = ({
  active = false,
  children,
  ...props
}: {
  active?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Link
    href={''}
    {...props}
    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? 'border-orange-400 text-gray-700 bg-orange-50 focus:text-indigo-800 focus:bg-orange-100 focus:border-orange-700'
        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
    }`}>
    {children}
  </Link>
);

export const ResponsiveNavButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <button
    className="block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium leading-5 focus:outline-none transition duration-150 ease-in-out border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300"
    {...props}
  />
);

export default ResponsiveNavLink;
