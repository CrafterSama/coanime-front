import { useQuery } from 'react-query';

import axios from '@/lib/axios';
import httpClient, { httpClientAuth, httpClientExternal } from '@/lib/http';

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

export const getArticleData = async (slug) => {
  const response = await httpClientExternal.get(`articles/${slug}`);
  return response;
};

export const useArticles = () => {
  return useQuery(['articles'], async () => {
    const response = await httpClientExternal.get(`articles`);
    return response.data;
  });
};

export const postUpdate = async (id: string | string[], params: any) =>
  await httpClient.put(`posts/${id}`, params);

export const imageUpload = async (files, model) => {
  const formData = new FormData();
  formData.append('model', model);
  formData.append('file', files[0], files[0].name);
  const csrf = () => httpClientAuth.get('/sanctum/csrf-cookie');
  await csrf();
  return await axios.post('/internal/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};
