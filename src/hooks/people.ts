import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const usePeople = ({ page = '' }: { page?: string }) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['people', page],
    queryFn: async () => {
      const response = await httpClient.get(`people`, params);
      return response.data;
    },
  });
};

export const usePerson = (slug: string) => {
  return useQuery({
    queryKey: ['person', slug],
    queryFn: async () => {
      const response = await httpClient.get(`people/${slug}`);
      return response.data;
    },
  });
};
