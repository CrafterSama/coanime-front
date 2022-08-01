import format from 'date-fns/format';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import Loading from '@/components/ui/Loading';
import { useViewArticle } from '@/hooks/posts';
import Link from 'next/link';

const UpdatePost = () => {
  const router = useRouter();
  const slug = router?.query?.slug;
  const { data = {}, isLoading } = useViewArticle(slug as string);

  console.log('data', data);

  const {
    title,
    description,
    tags,
    result: post,
    pathImage,
    otherArticles,
    relateds,
  } = data;

  return (
    <WebLayout>
      {isLoading && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      {post && (
        <>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={tags} />
          </Head>
          <article className="">
            <header className="w-full min-h-[95vh] relative">
              {pathImage && (
                <Image
                  src={pathImage}
                  className="w-full h-full"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                />
              )}
              <div className="full-header-title-bg">
                <div className="article__info-top">
                  <div className="categories">
                    <Link href={`/categories/${post?.categories?.slug}`}>
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
                    por <span className="user-author">{post?.users?.name}</span>
                  </p>
                </div>
              </div>
            </header>
            <div className="article__info-box">
              <div className="container-lg">
                <div className="article">
                  <div className="article-wrapper">
                    <main
                      className="info__article-content"
                      dangerouslySetInnerHTML={{ __html: post?.content }}
                    ></main>
                  </div>
                  <div className="article__side">
                    <div className="article-relatedTitles">
                      <div id="relatedTitle">
                        {post?.titles?.length > 0 && (
                          <div className="relatedTitle">
                            <div className="info__relatedTitle">
                              <div className="info__relatedTitle-image h-96 relative">
                                <Image
                                  className="w-full h-full"
                                  src={post?.titles?.[0]?.images?.name}
                                  alt={post?.titles?.[0]?.name}
                                  objectFit="cover"
                                  layout="fill"
                                />
                              </div>
                              <div className="info__related">
                                <p className="info__relatedTitle-category">
                                  {post?.titles?.[0]?.type?.name}
                                </p>
                                <Link
                                  href={`/ecma/titulos/${post?.titles?.[0]?.type?.slug}/${post?.titles?.[0]?.slug}`}
                                >
                                  <a>
                                    <h3 className="info__relatedTitle-title">
                                      {post?.titles?.[0]?.name}
                                    </h3>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="article-relateds">
                      <div id="relateds">
                        <div className="relateds">
                          {relateds?.length > 0 &&
                            relateds?.map((related) => (
                              <div key={related?.id} className="info__relateds">
                                <Link href={`/posts/${related?.slug}`}>
                                  <a>
                                    <div className="info__relateds-image w-24 h-24 relative">
                                      <Image
                                        src={related?.image}
                                        alt={related?.title}
                                        className="w-full h-full"
                                        objectFit="cover"
                                        layout="fill"
                                      />
                                    </div>
                                    <h3 className="info__relateds-title">
                                      {related?.title}
                                    </h3>
                                  </a>
                                </Link>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="tags">
                    <div className="tags">
                      <ul className="info__article-tags">
                        {post?.tags?.length > 0 &&
                          post?.tags?.map((tag) => (
                            <li key={tag?.id}>
                              <Link href={`/tags/${tag?.slug}`}>
                                <a className="tag">{tag?.name}</a>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>{' '}
                <div id="author">
                  <div className="author">
                    <div className="info__article-author">
                      <div className="flex flex-col w-32 h-32 relative">
                        <Image
                          src={post?.users?.profilePhotoPath}
                          alt={post?.title}
                          className="w-full h-full"
                          objectFit="cover"
                          layout="fill"
                          quality={90}
                        />
                      </div>
                      <div className="info__author">
                        <p className="info__author-name">
                          <span className="user-author">
                            {post?.users?.name}
                          </span>
                        </p>
                        <p
                          className="info__author-ocupation"
                          dangerouslySetInnerHTML={{ __html: post?.users?.bio }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="article__side-small hide">
                  <div className="article-relatedTitles">
                    <div id="relatedTitle">
                      <div className="relatedTitle"></div>
                    </div>
                  </div>

                  <div className="article-relateds">
                    <div id="relateds">
                      <div className="relateds"></div>
                    </div>
                  </div>
                </div>
                <div id="features">
                  <div className="features">
                    {otherArticles?.length > 0 && (
                      <>
                        <h2>
                          Otras noticias relacionadas a{' '}
                          {otherArticles?.[0]?.categories.name}
                        </h2>
                        <div className="info__features">
                          {otherArticles?.map((article) => (
                            <div
                              key={article?.id}
                              className="info__features-box flex flex-col gap-2"
                            >
                              <div className="info__features-image h-60 relative">
                                <Link href={`/posts/${article?.slug}`}>
                                  <a>
                                    <Image
                                      src={article.image}
                                      alt={article.title}
                                      className="w-full h-full"
                                      objectPosition="cover"
                                      layout="fill"
                                    />
                                  </a>
                                </Link>
                              </div>
                              <span className="categories">
                                <Link
                                  href={`/categorias/${article?.categories?.slug}`}
                                >
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </>
      )}
    </WebLayout>
  );
};

export default UpdatePost;
