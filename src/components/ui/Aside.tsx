import Link from 'next/link';
import { useRouter } from 'next/router';

import { CoanimeIcon, Logotype } from '@/components/ui/ApplicationLogo';
import MenuLink from '@/components/ui/MenuLink';
import { menu } from '@/constants/menu';
import { Show } from './Show';

const Aside = ({ isTiny }) => {
  const router = useRouter();
  const path = router.asPath.split('/')[router.asPath.split('/').length - 1];

  return (
    <aside
      className={`${
        isTiny ? 'w-14' : 'md:w-auto'
      } w-14 border-r border-gray-200`}>
      <div className="flex flex-col gap-4 m-auto">
        <div className="w-auto h-20 p-4 rounded-full self-center ">
          <Link
            href="/"
            className="md:w-full overflow-hidden text-left px-2 flex flex-row items-center gap-2">
            <CoanimeIcon className="h-10 text-orange-500" />
            <Show condition={!isTiny}>
              <Logotype className="h-6 fill-current text-gray-800" />
            </Show>
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
