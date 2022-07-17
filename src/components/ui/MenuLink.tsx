import { FC } from 'react';
import Link from 'next/link';

type MenuLinkProps = {
  icon?: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
  href?: string;
  className?: string;
};

const MenuLink: FC<MenuLinkProps> = ({ icon, active = false, children, href, className, ...props }) => (
  <li
    className={`flex flex-row justify-start w-ful;l items-center pl-6 pr-12 py-2 border-r-4 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? 'border-orange-400 focus:border-orange-700 text-orange-500'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
    }`}
  >
    <Link href={href} {...props}>
      <a className={`font-medium text-base menu-text flex flex-row gap-4 ${className}`}>
        {icon ?? ''}
        <span className="menu-txt">{children}</span>
      </a>
    </Link>
  </li>
);

export default MenuLink;
