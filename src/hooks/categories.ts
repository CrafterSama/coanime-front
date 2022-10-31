import { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useCategoriesList = () => {
  return useQuery(['categories'], async () => {
    const response = await httpClientExternal.get(`categories`);
    return response.data;
  });
};
