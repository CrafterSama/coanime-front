import Link from 'next/link';
import { useRouter } from 'next/router';

import { Logotype } from '@/components/ui/ApplicationLogo';
import MenuLink from '@/components/ui/MenuLink';
import { menu } from '@/constants/menu';

const Aside = () => {
  const router = useRouter();

  return (
    <aside className="w-auto border-r border-gray-200">
      <div className="flex flex-col gap-4 m-auto">
        <div className="w-auto h-20 p-4 rounded-full self-center ">
          <Link href="/">
            <a>
              <Logotype
                logoColor="#FE6A00"
                lettersColor="#FE6A00"
                className="h-10 fill-current"
              />
            </a>
          </Link>
        </div>
        <ul className="w-full flex flex-col gap-4">
          {menu.map((item) => (
            <MenuLink
              key={item.href}
              href={item.href}
              active={router.asPath.includes(item.href)}
              icon={item.icon}
            >
              {item.text}
            </MenuLink>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
