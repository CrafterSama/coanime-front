import { useState } from 'react';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { InputWithoutContext } from '@/components/ui/Input';
import SectionTitle from '@/components/ui/SectionTitle';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useSearchPosts } from '@/hooks/posts';
import { useSearchTitle } from '@/hooks/titles';

const SearchBox = () => {
  const [name, setName] = useState('');
  const { data: titles } = useSearchTitle({ name });
  const { data: posts } = useSearchPosts({ name });

  return (
    <div className="grid relative w-[290px]">
      <InputWithoutContext
        placeholder="Search"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-orange-300 focus:shadow-outline-orange sm:text-sm transition duration-150 ease-in-out"
        onChange={(e) => setName(e.target.value)}
        onBlur={(e) => {
          setTimeout(() => {
            e.target.value = '';
            setName('');
          }, 1000);
        }}
      />
      {name && (
        <div className="absolute top-10 max-h-[350px] overflow-y-auto overflow-x-hidden z-10 w-full mt-1 bg-white rounded-md shadow-lg pb-4">
          {titles?.result?.data?.length > 0 ? (
            <div className="px-2">
              <SectionTitle title="" subtitle="Titulos" />
              {titles?.result?.data?.map((title) => (
                <Link
                  key={title?.id}
                  href={`/ecma/titulos/${title?.type?.slug}/${title?.slug}`}
                >
                  <a className="flex gap-2 text-xs px-1 py-1 cursor-pointer group">
                    <div className="relative w-16 h-10 group-hover:h-24 group-hover:w-16 transition-all">
                      <Image
                        src={title?.images?.name ?? DEFAULT_IMAGE}
                        alt={title?.name}
                        layout="fill"
                        className="object-cover group-hover:object-scale-down"
                      />
                    </div>
                    <span className="flex flex-col gap-1">
                      <span className="flex gap-1 group-hover:text-orange-400">
                        <span className="max-w-[270px] overflow-hidden text-ellipsis">
                          {title?.name}
                        </span>
                      </span>
                      <span>
                        ({title?.type?.name},{' '}
                        {dayjs(title?.broadTime).format('YYYY')})
                      </span>
                      <span className="group-hover:flex hidden">
                        Estatus: {title?.status}
                      </span>
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-2">
              <SectionTitle title="" subtitle="Titulos" />
              <p className="text-center text-gray-400">No hay Resultados</p>
            </div>
          )}
          {posts?.result?.data?.length > 0 ? (
            <div className="px-2">
              <SectionTitle title="" subtitle="Noticias" />
              {posts?.result?.data?.map((post) => (
                <Link key={post?.id} href={`/posts/${post?.slug}`}>
                  <a className="flex gap-2 text-xs px-1 py-1 cursor-pointer group">
                    <div className="relative w-20 h-10 transition-all">
                      <Image
                        src={post?.image ?? DEFAULT_IMAGE}
                        alt={post?.title}
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                    <span className="flex flex-col gap-1">
                      <span className="flex gap-1 group-hover:text-orange-400">
                        <span className="max-w-[270px] overflow-hidden text-ellipsis">
                          {post?.title}
                        </span>
                      </span>
                      <span>({post?.categories.name})</span>
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-2">
              <SectionTitle title="" subtitle="Noticias" />
              <p className="text-center text-gray-400">No hay Resultados</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
