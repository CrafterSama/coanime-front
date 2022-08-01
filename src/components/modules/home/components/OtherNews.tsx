import { useArticles } from '@/hooks/posts';

const OtherNews = () => {
  const { data, isLoading } = useArticles();
  return <div className="other-news"></div>;
};

export default OtherNews;
