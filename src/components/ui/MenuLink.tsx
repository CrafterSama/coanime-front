import { FC } from 'react';

import Link from 'next/link';

type MenuLinkProps = {
  icon?: React.ReactNode;
  isTiny?: boolean;
  active?: boolean;
  children: React.ReactNode;
  href?: string;
  className?: string;
};

const MenuLink: FC<MenuLinkProps> = ({
  icon,
  isTiny = false,
  active = false,
  children,
  href,
  className,
  ...props
}) => (
  <li
    className={`flex flex-row justify-start w-ful;l items-center pl-2 pr-7 py-2 border-r-4 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? 'border-orange-400 focus:border-orange-600 text-orange-500'
        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
    }`}
  >
    <Link
      href={href}
      {...props}
      className={`font-semibold text-base menu-text flex flex-row w-full gap-4 px-4 py-2 rounded-lg ${
        active ? 'bg-orange-100' : 'hover:bg-orange-100'
      } ${className}`}>

      {icon && (
        <span className={`${isTiny ? '-ml-3' : 'md:ml-0'} -ml-3`}>
          {icon}
        </span>
      )}
      {!isTiny && (
        <span className="hidden md:block menu-txt">{children}</span>
      )}

    </Link>
  </li>
);

export default MenuLink;
