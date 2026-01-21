import { httpClientExternal } from '@/lib/http';

export const getCategory = async (category: string) => {
  const response = await httpClientExternal.get(`home?category=${category}`);
  return response;
};

export const getArticlesByCategories = async ({
  page = 1,
  category,
}: {
  page?: number;
  category: string;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(
    `articles?category=${category}`,
    {
      params,
    }
  );
  return response;
};
