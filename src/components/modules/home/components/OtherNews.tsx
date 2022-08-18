import { getArticlesData } from '@/services/posts';

const OtherNews = () => {
  const data = getArticlesData();
  return <div className="other-news px-4 xl:px-0"></div>;
};

export default OtherNews;
