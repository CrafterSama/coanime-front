import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Image from 'next/image';
import Link from 'next/link';

const PostHeader = ({ image, post }) => (
  <header className="w-full min-h-[95vh] relative">
    {image && (
      <Image
        fill
        src={image}
        quality={90}
        alt={post?.title}
        className="object-cover object-center"
        unoptimized
      />
    )}
    <div className="full-header-title-bg">
      <div className="article__info-top">
        {post?.categories?.name && (
          <div className="categories">
            <Link href={`/categorias/${post?.categories?.slug}`}>
              {post?.categories?.name}
            </Link>
          </div>
        )}
        <h1 className="info__article-title">{post?.title}</h1>
        <h2 className="info__article-subtitle">{post?.excerpt}</h2>
        <p>
          <span className="post-date">
            {post?.postponedTo &&
              dayjs(post?.postponedTo)
                .locale('es')
                .format('D MMMM, YYYY')}
          </span>{' '}
          por{' '}
          <Link
            href={`/users/[slug]`}
            as={`/users/${post?.users?.slug}`}
            className="text-gray-300">
            {post?.users?.name}
          </Link>
        </p>
      </div>
    </div>
  </header>
);

export default PostHeader;
