import { useQuery } from '@tanstack/react-query';

import { getTags } from '@/services/tags';

export const useTags = (tags: string, initialData?: any) => {
  return useQuery({
    queryKey: ['tags', tags],
    queryFn: () => getTags(tags),
    initialData: initialData,
    enabled: !!tags,
  });
};
