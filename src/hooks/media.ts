import httpClient from '@/lib/http';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MediaItem {
  id: number;
  uuid: string;
  name: string;
  fileName: string;
  mimeType: string;
  size: number;
  collectionName: string | null;
  disk: string;
  url: string;
  thumbUrl: string | null;
  isPlaceholder: boolean;
  originalUrl: string | null;
  modelType: string | null;
  modelId: number | null;
  modelTitle: string | null;
  modelSlug: string | null;
  /** When model is Title: type name (e.g. TV, Manga, OVA) */
  modelTitleType: string | null;
  createdAt: string;
  updatedAt: string;
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
    mediumUrl?: string | null;
    largeUrl?: string | null;
    customProperties?: Record<string, any>;
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
      url,
    }: {
      id: number;
      name?: string;
      file?: File;
      /** Image URL to replace media from (alternative to file upload) */
      url?: string;
    }) => {
      const formData = new FormData();
      if (name) {
        formData.append('name', name);
      }
      if (file) {
        formData.append('file', file);
      }
      if (url && url.trim()) {
        formData.append('url', url.trim());
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
