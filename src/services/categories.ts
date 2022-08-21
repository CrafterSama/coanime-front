import { httpClientExternal } from '@/lib/http';

export const getCategory = async (category) => {
  const response = await httpClientExternal.get(`categories/${category}`);
  return response;
};

export const getArticlesByCategories = async ({ page = 1, category }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(
    `categories/articles/${category}`,
    {
      params,
    }
  );
  return response;
};
