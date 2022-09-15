import Image from 'next/image';
import Link from 'next/link';

import { Permissions } from '@/components/modules/common/Permissions';
import { DEFAULT_IMAGE } from '@/constants/common';
import { PencilIcon } from '@heroicons/react/outline';

const OtherArticles = ({ articles }) => (
  <div className="features">
    {articles?.length > 0 && (
      <div className="info__features">
        {articles?.map((article) => (
          <div
            key={article?.id}
            className="info__features-box flex flex-col gap-2"
          >
            <div className="info__features-image h-60 relative">
              <Link href={`/posts/${article?.slug}`}>
                <a>
                  <Image
                    src={article.image ? article.image : DEFAULT_IMAGE}
                    alt={article.title}
                    className="w-full h-full"
                    objectPosition="cover"
                    layout="fill"
                  />
                </a>
              </Link>
              <Permissions>
                <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                  <Link href={`/dashboard/posts/${article?.slug}`}>
                    <a className="text-orange-400 text-xl font-bold p-1 rounded bg-gray-400 bg-opacity-70">
                      <PencilIcon className="w-5 h-5 text-white" />
                    </a>
                  </Link>
                </div>
              </Permissions>
            </div>
            <span className="categories">
              <Link href={`/categorias/${article?.categories?.slug}`}>
                <a className="text-orange-400 hover:text-white">
                  {article?.categories?.name}
                </a>
              </Link>
            </span>
            <h3 className="info__features-title">
              <Link href={`/posts/${article?.slug}`}>
                <a>{article?.title}</a>
              </Link>
            </h3>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OtherArticles;
