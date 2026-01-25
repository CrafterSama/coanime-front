import httpClient from '@/lib/http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MediaItem {
  id: number;
  uuid: string;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  collection_name: string;
  disk: string;
  url: string;
  thumb_url: string | null;
  is_placeholder: boolean;
  original_url: string | null;
  model_type: string | null;
  model_id: number | null;
  model_title: string | null;
  model_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaFilters {
  model_types?: string[];
  collections?: string[];
}

export interface MediaListResponse {
  code: number;
  message: string;
  result: {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters?: MediaFilters;
}

export interface MediaDetailResponse {
  code: number;
  message: string;
  data: MediaItem & {
    medium_url?: string | null;
    large_url?: string | null;
    custom_properties?: Record<string, any>;
  };
}

export const useMedia = ({
  page = 1,
  search = '',
  sortBy,
  sortDirection,
  perPage,
  modelType,
  collection,
  isPlaceholder,
}: {
  page?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  perPage?: number;
  modelType?: string;
  collection?: string;
  isPlaceholder?: boolean;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  if (search) {
    params['search'] = search;
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

  if (modelType) {
    params['model_type'] = modelType;
  }

  if (collection) {
    params['collection'] = collection;
  }

  if (isPlaceholder !== undefined) {
    params['is_placeholder'] = isPlaceholder;
  }

  return useQuery<MediaListResponse>({
    queryKey: [
      'media',
      page,
      search,
      sortBy,
      sortDirection,
      perPage,
      modelType,
      collection,
      isPlaceholder,
    ],
    queryFn: async () => {
      const paramsWithFilters = { ...params, include_filters: '1' };
      const response = await httpClient.get(`media`, {
        params: paramsWithFilters,
      });
      return response.data;
    },
  });
};

export const useMediaDetail = (id: number) => {
  return useQuery<MediaDetailResponse>({
    queryKey: ['media', id],
    queryFn: async () => {
      const response = await httpClient.get(`media/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      file,
    }: {
      id: number;
      name?: string;
      file?: File;
    }) => {
      const formData = new FormData();
      if (name) {
        formData.append('name', name);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await httpClient.put(`media/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};
