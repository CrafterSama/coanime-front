import { useQuery } from 'react-query';

import httpClient, { httpClientAuth } from '@/lib/http';

export const usePosts = () => {
  return useQuery(['posts'], async () => {
    const response = await httpClient.get(`posts`);
    return response.data;
  });
};

export const usePost = (slug: string) => {
  return useQuery(['post', slug], async () => {
    const response = await httpClient.get(`posts/${slug}`);
    return response.data;
  });
};

export const postUpdate = async (id: string | string[], params: any) =>
  await httpClient.put(`posts/${id}`, params);

export const imageUpload = async (params: any | FormData) => {
  const csrf = () => httpClientAuth.get('sanctum/csrf-cookie');
  await csrf();
  return await httpClient.put(`upload-images`, params);
};
