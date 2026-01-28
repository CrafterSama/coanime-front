import { useQuery } from '@tanstack/react-query';
import type {
  ActivityLogsParams,
  ActivityLogStatsParams,
} from '@/services/activity-logs';
import {
  getActivityLog,
  getActivityLogs,
  getActivityLogStats,
} from '@/services/activity-logs';

export function useActivityLogs(params: ActivityLogsParams = {}) {
  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => getActivityLogs(params),
  });
}

export function useActivityLog(id: string | number | null, enabled = true) {
  return useQuery({
    queryKey: ['activity-log', id],
    queryFn: () => getActivityLog(id!),
    enabled: enabled && id != null,
  });
}

export function useActivityLogStats(params: ActivityLogStatsParams = {}) {
  return useQuery({
    queryKey: ['activity-logs-stats', params],
    queryFn: () => getActivityLogStats(params),
  });
}
