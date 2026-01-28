import { httpClient } from '@/lib/http';

export type ActivityLogsParams = {
  page?: number;
  perPage?: number;
  userId?: number;
  subjectType?: string;
  description?: string;
  logName?: string;
  fromDate?: string;
  toDate?: string;
  controller?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  all?: boolean;
};

export type ActivityLogStatsParams = {
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export async function getActivityLogs(params: ActivityLogsParams = {}) {
  const p: Record<string, string | number | boolean | undefined> = {};
  if (params.page != null) p.page = params.page;
  if (params.perPage != null) p.per_page = params.perPage;
  if (params.userId != null) p.user_id = params.userId;
  if (params.subjectType) p.subject_type = params.subjectType;
  if (params.description) p.description = params.description;
  if (params.logName) p.log_name = params.logName;
  if (params.fromDate) p.from_date = params.fromDate;
  if (params.toDate) p.to_date = params.toDate;
  if (params.controller) p.controller = params.controller;
  if (params.sortBy) p.sort_by = params.sortBy;
  if (params.sortOrder) p.sort_order = params.sortOrder;
  if (params.all === true) p.all = true;

  const { data } = await httpClient.get('activity-logs', { params: p });
  return data;
}

export async function getActivityLog(id: string | number) {
  const { data } = await httpClient.get(`activity-logs/${id}`);
  return data;
}

export async function getActivityLogStats(params: ActivityLogStatsParams = {}) {
  const p: Record<string, string | number | undefined> = {};
  if (params.userId != null) p.user_id = params.userId;
  if (params.fromDate) p.from_date = params.fromDate;
  if (params.toDate) p.to_date = params.toDate;

  const { data } = await httpClient.get('activity-logs/stats', { params: p });
  return data;
}

export async function getActivityLogsByUser(
  userId: number,
  params: {
    page?: number;
    perPage?: number;
    fromDate?: string;
    toDate?: string;
  } = {}
) {
  const p: Record<string, string | number | undefined> = {};
  if (params.page != null) p.page = params.page;
  if (params.perPage != null) p.per_page = params.perPage;
  if (params.fromDate) p.from_date = params.fromDate;
  if (params.toDate) p.to_date = params.toDate;

  const { data } = await httpClient.get(`activity-logs/user/${userId}`, {
    params: p,
  });
  return data;
}
