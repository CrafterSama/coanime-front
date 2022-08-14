import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
import { useViewArticle } from '@/hooks/posts';

const UpdatePost = () => {
  const router = useRouter();
  const { slug } = router?.query;
  const { data = {}, isLoading } = useViewArticle(slug);

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
            <meta property="og:type" content="article" />
            <meta
              property="article:publisher"
              content="http://www.facebook.com/Coanime"
            />
            <meta property="article:tag" content={tags} />
            <meta property="article:section" content={post?.categories?.name} />
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

export default UpdatePost;
