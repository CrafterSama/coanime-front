import { DiscussionEmbed } from 'disqus-react';

interface Post {
  id: number | string;
  slug: string;
  title: string;
}

interface DisqusCommentsProps {
  post: Post;
}

const DisqusComments = ({ post }: DisqusCommentsProps) => {
  const disqusShortname = 'coanimenet';
  const disqusConfig = {
    url: `https://coanime.net/posts/${post.slug}`,
    identifier: String(post.id), // Single post id
    title: post.title, // Single post title
  };
  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
