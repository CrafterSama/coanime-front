import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

const PostHeader = ({ image, post }) => (
  <header className="w-full min-h-[95vh] relative">
    {image && (
      <Image
        src={image}
        className="w-full h-full"
        layout="fill"
        objectFit="cover"
        quality={90}
      />
    )}
    <div className="full-header-title-bg">
      <div className="article__info-top">
        <div className="categories">
          <Link href={`/categorias/${post?.categories?.slug}`}>
            <a>{post?.categories?.name}</a>
          </Link>
        </div>
        <h1 className="info__article-title">{post?.title}</h1>
        <h2 className="info__article-subtitle">{post?.excerpt}</h2>
        <p>
          <span className="post-date">
            {post?.postponedTo &&
              format(new Date(post?.postponedTo), 'd LLLL, yyyy')}
          </span>{' '}
          por{' '}
          <Link href={`/users/[slug]`} as={`/users/${post?.users?.slug}`}>
            <a className="text-gray-300">{post?.users?.name}</a>
          </Link>
        </p>
      </div>
    </div>
  </header>
);

export default PostHeader;
