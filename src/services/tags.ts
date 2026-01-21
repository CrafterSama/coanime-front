import { httpClientExternal } from '@/lib/http';

export const getTags = async (tag: string) => {
  const response = await httpClientExternal.get(`home/tags/${tag}`);
  return response;
};

export const getArticlesByTags = async ({
  tag,
  page = 1,
}: {
  tag: string;
  page?: number;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = tag
    ? await httpClientExternal.get(`articles/tags/${tag}`, {
        params,
      })
    : await httpClientExternal.get(`articles`, {
        params,
      });
  return response;
};
