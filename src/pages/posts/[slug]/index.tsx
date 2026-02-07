import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/layouts/web-layout';
import DisqusComments from '@/components/modules/common/disqus-comments';
import { Permissions } from '@/components/modules/common/permissions';
import Author from '@/components/modules/posts/components/author';
import OtherArticles from '@/components/modules/posts/components/other-articles';
import PostHeader from '@/components/modules/posts/components/post-header';
import Relateds from '@/components/modules/posts/components/relateds';
import Tags from '@/components/modules/posts/components/tags';
import TitleRelated from '@/components/modules/posts/components/title-related';
import { ArticleSkeleton } from '@/components/ui/article-skeleton';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { Show } from '@/components/ui/show';
import { useGetArticle } from '@/hooks/posts';
import { getArticleData } from '@/services/posts';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ShowArticleProps {
  slug: string;
  articleData: any;
  errors: any;
}

const ShowArticle = ({ slug, articleData, errors }: ShowArticleProps) => {
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const { data = {} } = useGetArticle(slug, articleData);
  const {
    title,
    description,
    tags,
    result: post,
    pathImage,
    otherArticles,
    relateds,
  } = (data as any) || {};

  useEffect(() => {
    if (errors) {
      toast.error(errors);
      router.push('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  useEffect(() => {
    if (articleData) window.scrollTo(0, 0);
  }, [articleData]);

  const onUpdateData = () => {
    setFetching(true);
    setTimeout(() => {
      setFetching(false);
    }, 800);
  };

  useEffect(() => {
    onUpdateData();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <WebLayout>
      {fetching && <ArticleSkeleton />}
      {post && (
        <>
          <Head>
            <meta name="copyright" content="Copyright (C) 2006 Coanime.net" />
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={tags} />
            <link rel="feed_image" href={post.image} />
            <link rel="image_src" href={post.image} />
            <meta name="robots" content="max-image-preview:large" />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="article" />
            <meta
              property="og:image"
              content={
                post?.image ??
                pathImage ??
                'https://coanime.s3.us-east-2.amazonaws.com/coanime-logo-default.svg'
              }
            />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
            <meta
              property="og:url"
              content={`https://coanime.net/posts/${post?.slug}`}
            />
            <meta property="og:site_name" content="Coanime.net" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@coanime" />
            <meta
              name="twitter:image"
              content={
                post?.image ??
                pathImage ??
                'https://coanime.s3.us-east-2.amazonaws.com/coanime-logo-default.svg'
              }
            />
            <meta name="twitter:title" content={post?.title} />
            <meta property="article:section" content={post?.categories?.name} />
            <meta property="article:tag" content={tags} />
            <meta
              property="article:published_time"
              content={
                post?.postponedTo
                  ? dayjs(post?.postponedTo)
                      .locale('es')
                      .format('DD MMMM, YYYY hh:mm a')
                  : dayjs(post?.createdAt)
                      .locale('es')
                      .format('DD MMMM, YYYY hh:mm a')
              }
            />
          </Head>
          <article className="">
            <PostHeader image={pathImage} post={post} />
            <Permissions>
              <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                <Link
                  href={`/dashboard/posts/${post.slug}`}
                  className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                  <PencilIcon className="w-5 h-5" />
                </Link>
              </div>
            </Permissions>
            <div className="article__info-box">
              <Section withContainer>
                <Section className="article">
                  <div className="article-wrapper">
                    <main
                      className="info__article-content"
                      dangerouslySetInnerHTML={{
                        __html: post?.content,
                      }}></main>
                  </div>
                  <div className="hidden lg:block article__side">
                    <div className="article-relatedTitles">
                      <TitleRelated titles={post?.titles} />
                    </div>
                    <div className="article-relateds">
                      <Relateds relateds={relateds} />
                    </div>
                  </div>
                  <div id="tags">
                    <Tags tags={post?.tags} />
                  </div>
                </Section>
                <Section id="author rounded-xl shadow-lg">
                  <Author users={post?.users} />
                </Section>
                <Section className="article__side-small lg:hidden">
                  <div className="article-relatedTitles">
                    <TitleRelated titles={post?.titles} />
                  </div>
                  <div className="article-relateds mx-auto">
                    <Relateds relateds={relateds} />
                  </div>
                </Section>
                <Section withContainer id="features">
                  <Show when={post}>
                    <SectionTitle
                      title=""
                      subtitle="¿nos dejas un comentario?"
                    />
                    <DisqusComments post={post} />
                  </Show>
                  <SectionTitle
                    title="Categorías"
                    subtitle="Algo mas relacionado a"
                    fancyText={post?.categories?.name}
                  />
                  <OtherArticles articles={otherArticles} />
                </Section>
              </Section>
            </div>
          </article>
        </>
      )}
    </WebLayout>
  );
};

export const getServerSideProps = async ({ params }: { params: any }) => {
  // Next.js 15: params puede ser una Promise
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  let errors = null;
  let response = null;
  let articleData = null;
  try {
    response = await getArticleData(slug as string);
    articleData = response.data;
  } catch (error) {
    errors = error.response.data.message.text;
  }

  return {
    props: {
      slug,
      articleData,
      errors,
      revalidate: 5 * 60,
    },
  };
};

export default ShowArticle;
