import Link from 'next/link';

const MenuLink = ({ active = false, children, ...props }) => (
  <li
    className={`flex justify-start w-ful;l items-center pl-6 pr-12 py-2 border-r-4 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? 'border-orange-400 text-gray-900 focus:border-orange-700'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
    }`}>
    <Link href={''} {...props}>
      <a className="font-medium text-base menu-text">{children}</a>
    </Link>
  </li>
);

export default MenuLink;
