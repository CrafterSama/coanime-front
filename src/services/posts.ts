import { httpClientExternal } from '@/lib/http';

export const getArticleData = async (slug) => {
  const response = await httpClientExternal.get(`articles/${slug}`);
  return response;
};

export const getArticlesData = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`articles`, { params });
  return response;
};
