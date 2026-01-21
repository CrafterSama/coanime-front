import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEntities = ({ page = '' }: { page?: string }) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['entities', page],
    queryFn: async () => {
      const response = await httpClient.get(`companies`, params);
      return response.data;
    },
  });
};

export const useEntity = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ['entity', slug],
    queryFn: async () => {
      const response = await httpClient.get(`companies/${slug}`);
      return response.data;
    },
  });
};
