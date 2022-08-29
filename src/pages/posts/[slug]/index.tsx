import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next/types';

import WebLayout from '@/components/Layouts/WebLayout';
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
import { scrollWindowToTop } from '@/utils/scroll';

const ShowArticle = ({ slug, articleData }) => {
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
    if (articleData) window.scrollTo(0, 0);
  }, [articleData]);

  const onUpdateData = () => {
    setFetching(true);
    setTimeout(() => {
      setFetching(false);
    }, 1200);
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
            <div className="article__info-box">
              <Section withContainer>
                <Section className="article">
                  <div className="article-wrapper">
                    <main
                      className="info__article-content"
                      dangerouslySetInnerHTML={{ __html: post?.content }}
                    ></main>
                  </div>
                  <div className="article__side">
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
                <Section className="article__side-small hide">
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
                </Section>
                <Section withContainer id="features">
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

/*export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}*/

export const getServerSideProps = async (context) => {
  const { slug } = context.params;
  const response = await getArticleData(slug as string);

  if (response.data.code === 404) {
    return {
      notFound: true,
    };
  }

  const articleData = response.data;

  return {
    props: {
      slug,
      articleData,
      revalidate: 5 * 60,
    },
  };
};

export default ShowArticle;
