import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEvents = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['events', page],
    queryFn: async () => {
      const response = await httpClient.get(`events`, params);
      return response.data;
    },
  });
};

export const useEvent = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const response = await httpClient.get(`events/${slug}`);
      return response.data;
    },
  });
};
