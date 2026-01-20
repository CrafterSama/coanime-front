import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: process.env.NEXT_PUBLIC_API_URL,
  },
  // Necesario para que las cookies (incluida XSRF-TOKEN) viajen con la request
  withCredentials: true,
  // Configuración estándar para Laravel Sanctum
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

axios.defaults.withCredentials = true;

// Interceptor para agregar el token CSRF a cada solicitud (solo en el navegador)
axios.interceptors.request.use((config) => {
  if (typeof document === 'undefined') return config;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    // Cabecera que Sanctum espera por defecto
    config.headers['X-XSRF-TOKEN'] = token;
  }

  return config;
});

export default axios;
