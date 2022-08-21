import Image from 'next/image';

import Section from '@/components/ui/Section';
import { DEFAULT_IMAGE } from '@/constants/common';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/outline';

const OtherNews = ({ articles }) => {
  return (
    <div className="other-news px-4 xl:px-0">
      <Section withContainer>
        <div className="flex flex-wrap gap-4 justify-center">
          {articles.map((article, index) => (
            <div
              key={index}
              className="w-[300px] h-[300px] relative overflow-hidden rounded"
            >
              <Image
                src={article.image ?? DEFAULT_IMAGE}
                alt={article.title}
                className="w-full h-auto object-cover"
                layout="fill"
              />
              <div className="overlayer"></div>
              <div className="absolute bottom-0 left-0 px-4 py-4 flex flex-col gap-4">
                <div className="categories">
                  <Link href={`/categorias/${article.categories.slug}`}>
                    <a>{article.categories.name}</a>
                  </Link>
                </div>
                <div className="title">
                  <Link href={`/posts/${article.slug}`}>
                    <a className="text-white text-xl font-bold">
                      {article.title}
                    </a>
                  </Link>
                </div>
                <span className="text-gray-200 flex flex-row gap-2">
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
          ))}
        </div>
      </Section>
    </div>
  );
};

export default OtherNews;
