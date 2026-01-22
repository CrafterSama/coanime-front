/**
 * Configuración especial para CORS y Sanctum
 */

export const configureDevelopmentCors = () => {
  // Solo en desarrollo y en el navegador
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const currentHost = window.location.hostname;
  const currentPort = window.location.port;

  // Detectar diferentes escenarios de desarrollo
  if (currentHost === 'localhost' && currentPort === '3000') {
    console.log('[CORS] Desarrollo en localhost:3000');
  } else if (currentHost === 'front.coanime.net' && currentPort === '3000') {
    console.log(
      '[CORS] Desarrollo en front.coanime.net:3000 (dominio cruzado)'
    );
  }
};

export const getBackendUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment && typeof window !== 'undefined') {
    const currentHost = window.location.hostname;

    // Si estamos en localhost:3000, usar el backend de dev
    if (currentHost === 'localhost') {
      return 'https://dev.coanime.net'; // Backend de desarrollo
    }

    // Si estamos en front.coanime.net:3000, usar el backend de dev
    if (currentHost === 'front.coanime.net') {
      return 'https://dev.coanime.net'; // Backend de desarrollo
    }
  }

  // Producción: usar API de producción
  return 'https://api.coanime.net';
};

export const isDevelopmentCrossOrigin = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;
  const port = window.location.port;

  // Desarrollo en localhost:3000 → dev.coanime.net (cross-origin)
  return hostname === 'localhost' && port === '3000';
};
