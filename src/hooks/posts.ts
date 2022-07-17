import { httpClientAuth } from './../lib/http';
import axios from '@/lib/axios';
import httpClient from '@/lib/http';
import { useMutation, useQuery } from 'react-query';

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

export const useUpdatePost = (id: string | string[], params: any) =>
  httpClient.put(`posts/${id}`, params);

export const usePostImageUpload = (id: string | string[], params: any) =>
  httpClient.put(`posts/${id}`, params);
