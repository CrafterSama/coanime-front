/**
 * Helper para manejar errores y reintentos en getStaticProps
 * Resuelve el problema de "socket hang up" durante el build time
 */

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos
const REQUEST_TIMEOUT = 15000; // 15 segundos

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: any): boolean => {
  // Errores que pueden ser reintentados
  const retryableErrors = [
    'socket hang up',
    'econnreset',
    'etimedout',
    'enotfound',
    'econnrefused',
    'request timeout',
  ];

  const errorMessage = String(error?.message || '').toLowerCase();
  const errorCode = String(error?.code || '').toLowerCase();

  // Verificar si es un error de conexión o timeout
  const isConnectionError = retryableErrors.some(
    (err) => errorMessage.includes(err) || errorCode.includes(err)
  );

  // Verificar si es un error 5xx del servidor
  const isServerError = error?.response?.status >= 500;

  return isConnectionError || isServerError;
};

/**
 * Ejecuta una función con reintentos y manejo de errores
 * @param fn Función async que ejecutar
 * @param options Opciones de configuración
 * @returns Resultado de la función o lanza el error si falla
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onError?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> => {
  const { maxRetries = MAX_RETRIES, retryDelay = RETRY_DELAY, onError } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        ),
      ]);
      return result;
    } catch (error: any) {
      lastError = error;

      if (onError) {
        onError(error, attempt);
      }

      // Si no es un error reintenable o es el último intento, salir
      if (!isRetryableError(error) || attempt === maxRetries) {
        break;
      }

      // Esperar antes de reintentar (backoff exponencial)
      const waitTime = retryDelay * attempt;
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[getStaticProps] Error en intento ${attempt}/${maxRetries}, reintentando en ${waitTime}ms:`,
          error?.message || error?.code || error
        );
      }
      await delay(waitTime);
    }
  }

  // Lanzar el error si todos los reintentos fallaron
  throw lastError;
};
