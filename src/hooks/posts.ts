import httpClient, { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const usePosts = ({
  page = 1,
  name = '',
  sortBy,
  sortDirection,
  perPage,
  categoryId,
  userId,
}: {
  page?: number;
  name?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  perPage?: number;
  categoryId?: string | number;
  userId?: string | number;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  if (name) {
    params['name'] = name;
  }

  if (sortBy) {
    params['sort_by'] = sortBy;
  }

  if (sortDirection) {
    params['sort_direction'] = sortDirection;
  }

  if (perPage) {
    params['per_page'] = perPage;
  }

  if (categoryId) {
    params['category_id'] = categoryId;
  }

  if (userId) {
    params['user_id'] = userId;
  }

  return useQuery({
    queryKey: [
      'posts',
      page,
      name,
      sortBy,
      sortDirection,
      perPage,
      categoryId,
      userId,
    ],
    queryFn: async () => {
      // Incluir filtros en la primera carga o cuando cambian los filtros
      const paramsWithFilters = { ...params, include_filters: '1' };
      const response = await httpClient.get(`posts`, {
        params: paramsWithFilters,
      });
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

  // httpClient ya tiene configurado:
  // - baseURL: '/internal'
  // - Interceptor que agrega automáticamente el token JWT
  // - Transformaciones de datos
  // - Manejo de errores 401
  return await httpClient.post('/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
