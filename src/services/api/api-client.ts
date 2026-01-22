import { API_URL } from '@/constants/common';
import { getBackendUrl } from '@/utils/cors-config';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import snakecaseKeys from 'snakecase-keys';

export const HTTP_METHODS = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH',
};

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}`;
};

const getApiExternalUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}`;
};

const getAuthApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}`;
};

/**
 * Get CSRF token from cookies (client-side only)
 */
const getCsrfToken = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return document.cookie
    .split('; ')
    .find((row) => row.trim().startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
};

/**
 * Create an Axios instance with default configuration
 */
const createInstance = (baseURL: string, config?: AxiosRequestConfig) => {
  // In SSR, skip transformations to avoid serialization issues
  const isServer = typeof window === 'undefined';

  // In SSR, skip transformations to avoid serialization and recursion issues
  const transformRequest: AxiosRequestConfig['transformRequest'] = isServer
    ? undefined
    : [
        (data: unknown) => {
          // Skip transformation for non-objects, FormData, or empty data
          if (!data || typeof data !== 'object' || data instanceof FormData) {
            return data;
          }

          // Skip if it's already a string (JSON serialized)
          if (typeof data === 'string') {
            return data;
          }

          try {
            // Only transform plain objects
            if (Array.isArray(data)) {
              return data;
            }

            return snakecaseKeys(data as Record<string, unknown>, {
              exclude: ['_destroy'],
              deep: false, // Avoid deep recursion issues
            });
          } catch {
            // If transformation fails, return original data
            return data;
          }
        },
      ];

  const transformResponse: AxiosRequestConfig['transformResponse'] = isServer
    ? undefined
    : [
        // Primero, parsear el JSON si es string (Axios pasa el string raw aquí)
        (data: unknown) => {
          // Si data es un string, parsearlo a JSON
          if (typeof data === 'string') {
            try {
              return JSON.parse(data);
            } catch {
              // Si no es JSON válido, retornar el string original
              return data;
            }
          }
          // Si ya es un objeto, retornarlo tal cual
          return data;
        },
        // NO aplicar transformaciones camelCase aquí para evitar recursión
        // Las transformaciones se harán en los hooks/servicios cuando sea necesario
      ];

  const backendUrl = typeof window !== 'undefined' ? getBackendUrl() : baseURL;

  const instance = axios.create({
    baseURL: backendUrl,
    withCredentials: true, // Siempre true para Sanctum en el cliente
    responseType: 'json', // Asegurar que Axios parsee JSON automáticamente
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && {
        'X-Requested-With': 'XMLHttpRequest',
      }),
    },
    transformRequest,
    transformResponse,
    ...config,
  });

  // Request interceptor: Add CSRF token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getCsrfToken();

      if (token && config.headers) {
        config.headers['X-XSRF-TOKEN'] = token;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Error handling and Sentry logging
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Log error to Sentry if available
      if (typeof window !== 'undefined') {
        /*try {
          // Dynamic import to avoid issues if Sentry is not configured
          import("@sentry/nextjs")
            .then((Sentry) => {
              Sentry.captureException(error, {
                tags: {
                  api: "axios",
                  url: error.config?.url,
                  method: error.config?.method,
                },
                extra: {
                  status: error.response?.status,
                  statusText: error.response?.statusText,
                  data: error.response?.data,
                },
              });
            })
            .catch(() => {
              // Sentry not available, silently continue
            });
        } catch {
          // Sentry not available, silently continue
        }*/
        console.error(AxiosError);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Internal API client (for dashboard/admin endpoints)
export const httpClient = createInstance(getApiUrl());

// External API client (for public endpoints)
export const httpClientExternal = createInstance(getApiExternalUrl());

// Auth API client (for authentication endpoints)
export const httpClientAuth = createInstance(getAuthApiUrl());

// Default export: Main API client (uses base URL)
const api = createInstance(process.env.NEXT_PUBLIC_BACKEND_URL || API_URL);

/**
 * Configure interceptors for form data uploads
 * This function should be called once during app initialization if needed
 */
export const configureFormDataHeaders = (onUnauthorized?: () => void) => {
  httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.headers) {
        config.headers.set('X-Requested-With', 'XMLHttpRequest');
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  if (onUnauthorized) {
    httpClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
};

export default api;
