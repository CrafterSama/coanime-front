import Image from 'next/image';
import Link from 'next/link';

import { Permissions } from '@/components/modules/common/Permissions';
import { DEFAULT_IMAGE } from '@/constants/common';
import { PencilIcon } from '@heroicons/react/24/outline';

const OtherArticles = ({ articles, total = null }) => (
  <div className="features">
    {total === 0 && (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-xl font-bold text-center text-gray-400">
          No hay resultados
        </h2>
      </div>
    )}
    {articles?.length > 0 && (
      <div className="info__features">
        {articles?.map((article) => (
          <div
            key={article?.id}
            className="info__features-box flex flex-col gap-2">
            <div className="info__features-image h-60 relative">
              <Link href={`/posts/${article?.slug}`}>
                <Image
                  src={article.image ? article.image : DEFAULT_IMAGE}
                  alt={article.title}
                  className="w-full h-full"
                  fill
                  unoptimized
                />
              </Link>
              <Permissions>
                <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                  <Link
                    href={`/dashboard/posts/${article?.slug}`}
                    className="text-orange-400 text-xl font-bold p-1 rounded bg-gray-400 bg-opacity-70">
                    <PencilIcon className="w-5 h-5 text-white" />
                  </Link>
                </div>
              </Permissions>
            </div>
            <span className="categories">
              <Link
                href={`/categorias/${article?.categories?.slug}`}
                className="text-orange-400 hover:text-white">
                {article?.categories?.name}
              </Link>
            </span>
            <h3 className="info__features-title">
              <Link href={`/posts/${article?.slug}`}>{article?.title}</Link>
            </h3>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OtherArticles;
