import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { ClockIcon, UserCircleIcon } from '@heroicons/react/outline';

const RecentPosts = ({ posts }) => (
  <div className="recent-posts px-4 xl:px-0">
    {posts?.map((post) => (
      <div key={post.id} className="box">
        <div className="box__item">
          <figure className="item__image">
            <Image
              src={post.image}
              alt={post.title}
              className="w-full h-full"
              objectFit="cover"
              layout="fill"
              quality={90}
            />
          </figure>
          <div className="overlayer"></div>
          <div className="item__info text-shadow bottom-attach flex flex-col gap-2">
            <div className="categories">
              <Link href={`/categorias/${post?.categories?.slug}`}>
                <a>{post?.categories?.name}</a>
              </Link>
            </div>
            <h2 className="info__news-title">
              <Link href={`/posts/[slug]`} as={`/posts/${post?.slug}`}>
                <a>{post?.title}</a>
              </Link>
            </h2>
            <h4 className="info__news-sub-title">{post?.excerpt}</h4>
            <p className="flex flex-row gap-4">
              <span className="flex flex-row gap-2">
                <UserCircleIcon className="w-6 h-6" />
                <span className="text-gray-300">{post?.users?.name}</span>
              </span>
              <span className="flex flex-row gap-2">
                <ClockIcon className="w-6 h-6" />
                <span className="text-gray-300">
                  {format(new Date(post?.postponedTo), 'd LLLL, yyyy')}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default RecentPosts;
