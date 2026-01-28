import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/posts';
import { formatLocaleDate } from '@/utils/date';
import Image from 'next/image';
import Link from 'next/link';

type ArticleCardProps = {
  post: Post;
  size?: 'small' | 'medium' | 'large';
};

export function ArticleCard({ post, size }: ArticleCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md ${
        size === 'large' ? 'col-span-2' : ''
      }`}>
      <Link href={`/posts/${post?.slug}`} className="block">
        <div
          className={`relative ${
            size === 'small' ? 'h-60' : size === 'large' ? 'h-80' : 'h-60'
          }`}>
          <Image
            src={post?.image || '/placeholder.svg'}
            alt={post?.title || ''}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Badge className="mb-2 bg-orange-500 hover:bg-orange-600">
              {post?.categories?.name}
            </Badge>
            <h2
              className={`mb-2 font-bold text-white ${
                size === 'small'
                  ? 'text-lg'
                  : size === 'large'
                  ? 'text-2xl'
                  : 'text-xl'
              }`}>
              {post?.title}
            </h2>
            {post?.excerpt && size !== 'small' && (
              <p className="mb-2 text-sm text-gray-200 line-clamp-2">
                {post?.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{post?.users?.name}</span>
              <span>•</span>
              <span>{formatLocaleDate(post?.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
