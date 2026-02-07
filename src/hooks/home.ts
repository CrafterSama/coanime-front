import { getBroadcastToday, getHomeData, getSeriesSoon } from '@/services/home';
import { getArticlesData, getArticlesJapan } from '@/services/posts';
import { useQuery } from '@tanstack/react-query';

export const useBroadcastToday = (broadcastData?: any) => {
  return useQuery({
    queryKey: ['broadcastToday'],
    queryFn: getBroadcastToday,
    initialData: broadcastData,
  });
};

export const useSeriesSoon = (seriesSoonData?: any) => {
  return useQuery({
    queryKey: ['seriesSoon'],
    queryFn: getSeriesSoon,
    initialData: seriesSoonData,
  });
};

export const useHomeData = (homeData?: any) => {
  return useQuery({
    queryKey: ['homeData'],
    queryFn: getHomeData,
    initialData: homeData,
  });
};

export const useArticlesData = (page: number) => {
  return useQuery({
    queryKey: ['articlesData', page],
    queryFn: () => getArticlesData({ page }),
    retry: false,
    enabled: !!page,
  });
};

export const useArticlesJapan = (page: number) => {
  return useQuery({
    queryKey: ['articlesJapan', page],
    queryFn: () => getArticlesJapan({ page }),
    retry: false,
    enabled: !!page,
  });
};
