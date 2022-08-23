import { useQuery } from 'react-query';

import axios from '@/lib/axios';
import httpClient, { httpClientAuth, httpClientExternal } from '@/lib/http';

export const usePosts = ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['posts'], async () => {
    const response = await httpClient.get(`posts-dashboard`, { params });
    return response.data;
  });
};

export const usePost = (slug: string) => {
  return useQuery(['post', slug], async () => {
    const response = await httpClient.get(`posts/${slug}`);
    return response.data;
  });
};

export const useGetArticle = (slug: string) => {
  return useQuery(['useArticle', slug], async () => {
    const response = await httpClientExternal.get(`articles/${slug}`);
    return response.data;
  });
};

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
