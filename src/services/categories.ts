import { httpClientExternal } from '@/lib/http';

export const getCategory = async (category) => {
  const response = await httpClientExternal.get(`categories/${category}`);
  return response;
};
