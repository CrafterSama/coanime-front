/**
 * QueryClient Singleton
 * Crea una única instancia de QueryClient para toda la aplicación
 * Evita recreación en cada render y mejora el rendimiento
 */

import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Con Next.js SSR, queremos establecer un staleTime por defecto
        // para evitar refetch inmediatamente en el cliente
        staleTime: 30000, // 30 segundos
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: siempre hacer una nueva query client
    return makeQueryClient();
  }
  // Browser: usar singleton pattern para mantener la misma query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
