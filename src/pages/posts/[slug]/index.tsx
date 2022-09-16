import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import WebLayout from '@/components/Layouts/WebLayout';
import DisqusComments from '@/components/modules/common/DisqusComments';
import { Permissions } from '@/components/modules/common/Permissions';
import Author from '@/components/modules/posts/components/Author';
import OtherArticles from '@/components/modules/posts/components/OtherArticles';
import PostHeader from '@/components/modules/posts/components/PostHeader';
import Relateds from '@/components/modules/posts/components/Relateds';
import Tags from '@/components/modules/posts/components/Tags';
import TitleRelated from '@/components/modules/posts/components/TitleRelated';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { getArticleData } from '@/services/posts';
import { PencilIcon } from '@heroicons/react/outline';

const ShowArticle = ({ slug, articleData, errors }) => {
  const router = useRouter();
  const [fetching, setFetching] = useState(false);
  const { data = {}, isLoading } = useQuery(
    ['viewArticles', slug],
    getArticleData,
    {
      initialData: articleData,
    }
  );
  const {
    title,
    description,
    tags,
    result: post,
    pathImage,
    otherArticles,
    relateds,
  } = data;

  useEffect(() => {
    if (errors) {
      toast.error(errors);
      router.push('/404');
    }
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
      {fetching && (
        <div className="flex justify-center content-center min-w-screen min-h-screen">
          <Loading size={16} />
        </div>
      )}
      {post && (
        <>
          <Head>
            <meta name="copyright" content="Copyright (C) 2006 Coanime.net" />
            <title>{title}</title>
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
                  ? format(
                      new Date(post?.postponedTo),
                      'dd LLLL, yyyy hh:mm a',
                      { locale: es }
                    )
                  : format(new Date(post?.createdAt), 'dd LLLL, yyyy hh:mm a')
              }
            />
          </Head>
          <article className="">
            <PostHeader image={pathImage} post={post} />
            <Permissions>
              <div className="absolute bottom-0 right-0 px-2 py-2 flex flex-col gap-4">
                <Link href={`/dashboard/posts/${post.slug}`}>
                  <a className="text-white text-xl font-bold p-1 rounded bg-gray-600 bg-opacity-70">
                    <PencilIcon className="w-5 h-5" />
                  </a>
                </Link>
              </div>
            </Permissions>
            <div className="article__info-box">
              <Section withContainer>
                <Section className="article">
                  <div className="article-wrapper">
                    <main
                      className="info__article-content"
                      dangerouslySetInnerHTML={{ __html: post?.content }}
                    ></main>
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
                <Section id="author">
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
                  <SectionTitle
                    title="Categorías"
                    subtitle="Algo mas relacionado a"
                    fancyText={post?.categories?.name}
                  />
                  <OtherArticles articles={otherArticles} />
                  <SectionTitle
                    title="Charlemos"
                    subtitle="Sección de comentarios"
                  />
                  <DisqusComments post={post} />
                </Section>
              </Section>
            </div>
          </article>
        </>
      )}
    </WebLayout>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { slug } = params;
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
