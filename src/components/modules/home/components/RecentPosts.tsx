import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_IMAGE } from '@/constants/common';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import React from 'react';

const RecentPosts = ({ posts }: { posts?: any[] }) => (
  <div className="recent-posts px-4 xl:px-0">
    {posts?.map((post: any) => (
      <div key={post.id} className="box">
        <div className="box__item">
          <figure className="item__image">
            <Image
              src={post.image ?? DEFAULT_IMAGE}
              alt={`${post.title} - Coanime.net`}
              className="object-cover object-center"
              fill
              quality={90}
              unoptimized
            />
          </figure>
          <div className="overlayer"></div>
          <div className="item__info text-shadow bottom-attach flex flex-col gap-2">
            <div className="categories">
              <Link href={`/categorias/${post?.categories?.slug}`}>
                {post?.categories?.name}
              </Link>
            </div>
            <h2 className="info__news-title">
              <Link href={`/posts/[slug]`} as={`/posts/${post?.slug}`}>
                {post?.title}
              </Link>
            </h2>
            <h4 className=" ">{post?.excerpt}</h4>
            <p className="flex flex-row gap-4">
              <span className="flex flex-row gap-2">
                <UserCircleIcon className="w-6 h-6" />
                <Link
                  href={`/users/[slug]`}
                  as={`/users/${post?.users?.slug}`}
                  className="text-gray-300">
                  {post?.users?.name}
                </Link>
              </span>
              <span className="flex flex-row gap-2">
                <ClockIcon className="w-6 h-6" />
                <span className="text-gray-300">
                  {dayjs(
                    post?.postponedTo ? post?.postponedTo : post?.createdAt
                  )
                    .locale('es')
                    .format('D MMMM, YYYY')}
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
