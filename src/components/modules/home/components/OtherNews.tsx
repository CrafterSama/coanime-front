import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { Permissions } from '@/components/modules/common/Permissions';
import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import { ClockIcon, PencilIcon } from '@heroicons/react/24/outline';

const OtherNews = ({ articles }) => {
  return (
    <div className="other-news px-4 xl:px-0">
      <Section withContainer>
        <div className="flex flex-wrap gap-4 justify-center">
          {articles?.map((article, index) => (
            <div
              key={index}
              className="article w-full sm:w-[300px] h-[300px] relative overflow-hidden rounded">
              <Image
                src={article.image ?? DEFAULT_IMAGE}
                alt={`${article.title} - Coanime.net`}
                className="w-full h-auto object-cover"
                fill
                unoptimized
              />
              <div className="overlayer"></div>
              <div className="absolute bottom-0 left-0 px-4 py-4 flex flex-col gap-1">
                <div className="categories">
                  <Link href={`/categorias/${article.categories.slug}`}>
                    {article.categories.name}
                  </Link>
                </div>
                <div className="title">
                  <Link
                    href={`/posts/${article.slug}`}
                    className="text-white text-xl font-bold">
                    {article.title}
                  </Link>
                </div>
                <div className="flex gap-2 justify-start items-center">
                  <span className="text-gray-200 flex flex-row gap-2 text-sm">
                    <ClockIcon className="w-6 h-6" />
                    {format(
                      new Date(
                        article.postponedTo
                          ? article.postponedTo
                          : article.createdAt
                      ),
                      'dd LLLL, yyyy',
                      {
                        locale: es,
                      }
                    )}
                  </span>
                </div>
              </div>
              <Permissions>
                <div className="absolute top-0 right-0 px-2 py-2 flex flex-col gap-4">
                  <Link
                    href={`/dashboard/posts/${article.slug}`}
                    className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                </div>
              </Permissions>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default OtherNews;
