import { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useCategoriesList = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await httpClientExternal.get(`categories`);
      return response.data;
    },
  });
};

export const useCategory = (category: string) => {
  return useQuery({
    queryKey: ['category', category],
    queryFn: async () => {
      const response = await httpClientExternal.get(
        `home?category=${category}`
      );
      return response.data;
    },
    enabled: !!category,
  });
};
