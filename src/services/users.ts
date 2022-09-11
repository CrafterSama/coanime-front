import { httpClientAuth } from '@/lib/http';

export const getUser = async () => {
  const response = await httpClientAuth.get('/api/user');

  return response.data;
};
