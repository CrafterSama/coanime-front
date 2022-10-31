import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEvents = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['events', page], async () => {
    const response = await httpClient.get(`events`, params);
    return response.data;
  });
};

export const useEvent = (slug: string) => {
  return useQuery(['event', slug], async () => {
    const response = await httpClient.get(`events/${slug}`);
    return response.data;
  });
};
