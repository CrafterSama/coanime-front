import httpClient, { httpClientExternal } from '@/lib/http';

export const postUpdate = async (id: string | string[], params: any) =>
  await httpClient.put(`posts/${id}`, params);

export const postCreate = async (params: any) =>
  await httpClient.post(`posts`, params);

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
