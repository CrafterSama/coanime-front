import axios from '@/lib/axios';
import httpClient, { httpClientAuth, httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const usePosts = ({
  page = 1,
  name = '',
}: {
  page?: number;
  name?: string;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  if (name) {
    params['name'] = name;
  }

  return useQuery({
    queryKey: ['posts', page, name],
    queryFn: async () => {
      const response = await httpClient.get(`posts`, { params });
      return response.data;
    },
  });
};

export const useSearchPosts = ({ name = '' }: { name?: string }) => {
  const params: Record<string, any> = {};

  if (name) {
    params['name'] = name;
  }

  const isLongEnough = name.length >= 2;
  return useQuery({
    queryKey: ['posts-search', name],
    queryFn: async () => {
      const response = await httpClientExternal.get(`posts-search`, { params });
      return response.data;
    },
    enabled: isLongEnough,
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await httpClient.get(`posts/${slug}`);
      return response.data;
    },
  });
};

export const useGetArticle = (slug: string) => {
  return useQuery({
    queryKey: ['useArticle', slug],
    queryFn: async () => {
      const response = await httpClientExternal.get(`articles/${slug}`);
      return response.data;
    },
  });
};

export const imageUpload = async (files: FileList, model: string) => {
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
