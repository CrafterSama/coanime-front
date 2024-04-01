import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await httpClient.get(`dashboard`);
      return response.data;
    },
  });
};
