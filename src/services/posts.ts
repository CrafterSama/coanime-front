import { httpClientExternal } from '@/lib/http';

export const getArticleData = async (slug) => {
  const response = await httpClientExternal.get(`articles/${slug}`);
  return response;
};

export const getArticlesData = async () => {
  const response = await httpClientExternal.get(`articles`);
  return response;
};
