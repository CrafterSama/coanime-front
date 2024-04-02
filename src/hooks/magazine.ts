import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useMagazines = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['magazines', page],
    queryFn: async () => {
      const response = await httpClient.get(`magazine`, params);
      return response.data;
    },
  });
};

export const useMagazine = (slug: string) => {
  return useQuery({
    queryKey: ['magazine', slug],
    queryFn: async () => {
      const response = await httpClient.get(`magazines/${slug}`);
      return response.data;
    },
  });
};
