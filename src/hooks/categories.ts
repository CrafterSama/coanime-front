import { httpClientExternal } from '@/lib/http';
import { getCategory } from '@/services/categories';
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

export const useCategory = (category: string, initialData?: any) => {
  return useQuery({
    queryKey: ['categories', category],
    queryFn: () => getCategory(category),
    initialData: initialData,
    enabled: !!category,
  });
};

export const useCategoryData = (category: string) => {
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
