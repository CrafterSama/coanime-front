const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silenciar warning de workspace root
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: [
      'coanime.s3.us-east-2.amazonaws.com',
      's3.us-east-2.amazonaws.com',
      'www.coanime.net',
      'api.coanime.net',
      'images.coanime.net',
      'coanime.net',
      'cdn.myanimelist.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coanime.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.coanime.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.coanime.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.coanime.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'coanime.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Next.js 15: Mejora el manejo de CSS de node_modules, no necesitamos configuraciones especiales
  // El límite de largePageDataBytes ya no es necesario, Next.js 15 tiene límites más altos por defecto

  // ESLint: Ignorar warnings durante el build (solo errores bloquean el build)
  eslint: {
    // Warning: Esto no afecta el comportamiento de producción.
    ignoreDuringBuilds: false,
  },

  // TypeScript: Ignorar errores de TypeScript durante el build si es necesario
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};
