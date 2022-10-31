import { useQuery } from '@tanstack/react-query';

import { httpClientExternal } from '@/lib/http';

export const useCategoriesList = () => {
  return useQuery(['categories'], async () => {
    const response = await httpClientExternal.get(`categories`);
    return response.data;
  });
};
