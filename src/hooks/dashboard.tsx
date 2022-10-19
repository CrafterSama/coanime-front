import httpClient from '@/lib/http';
import { useQuery } from 'react-query';

export const useDashboard = () => {
  return useQuery(['dashboard'], async () => {
    const response = await httpClient.get(`dashboard`);
    return response.data;
  });
};
