import { useQuery } from 'react-query';

import httpClient from '@/lib/http';

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

export const postUpdate = (id: string | string[], params: any) => httpClient.put(`posts/${id}`, params);

export const usePostImageUpload = (id: string | string[], params: any) => httpClient.put(`posts/${id}`, params);
