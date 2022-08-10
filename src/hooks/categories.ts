import { useQuery } from 'react-query';

import { httpClientExternal } from '@/lib/http';

export const useCategories = (category) => {
  return useQuery(['categories', category], async () => {
    const response = await httpClientExternal.get(`categories/${category}`);
    return response.data;
  });
};
