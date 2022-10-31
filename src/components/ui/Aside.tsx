import Link from 'next/link';
import { useRouter } from 'next/router';

import { Logotype } from '@/components/ui/ApplicationLogo';
import MenuLink from '@/components/ui/MenuLink';
import { menu } from '@/constants/menu';

const Aside = ({ isTiny = false }) => {
  const router = useRouter();
  const path = router.asPath.split('/')[router.asPath.split('/').length - 1];
  //debugger; // eslint-disable-line

  return (
    <aside
      className={`${
        isTiny ? 'w-14' : 'md:w-auto'
      } w-14 border-r border-gray-200`}>
      <div className="flex flex-col gap-4 m-auto">
        <div className="w-auto h-20 p-4 rounded-full self-center ">
          <Link
            href="/"
            className={`${
              isTiny ? 'w-14' : 'w-14 md:w-full'
            } grid overflow-hidden text-left px-2`}>
            <Logotype
              logoColor="#FE6A00"
              lettersColor="#FE6A00"
              className="h-10 fill-current"
            />
          </Link>
        </div>
        <ul className="w-full flex flex-col gap-4">
          {menu.map((item) => (
            <MenuLink
              key={item.href}
              href={item.href}
              active={path === item.breadcrumb}
              icon={item.icon}
              isTiny={isTiny}>
              {item.text}
            </MenuLink>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
