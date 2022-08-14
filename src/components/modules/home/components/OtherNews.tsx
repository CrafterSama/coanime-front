import { useArticles } from '@/hooks/posts';

const OtherNews = () => {
  const { data, isLoading } = useArticles();
  return <div className="other-news px-4 xl:px-0"></div>;
};

export default OtherNews;
